from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Signature import pss
from Crypto.Hash import SHA256
import requests
import base64
import json


class Client:

    def __init__(self):
        self.generate_keys()
        # generarea unei chei random pt sesiune
        self.merchant_session_key = get_random_bytes(16)
        self.pg_session_key = get_random_bytes(16)

        #  encrypt auth translate advanced encryption
        cipher_aes = AES.new(self.merchant_session_key, AES.MODE_EAX)
        self.merchant_nonce = cipher_aes.nonce
        cipher_aes = AES.new(self.pg_session_key, AES.MODE_EAX)
        self.pg_nonce = cipher_aes.nonce
        self.nonce = ''

        #citirea cheilor clientului
        self.private_key = open("client_private.pem").read()
        self.public_key = open("client_public.pem").read()

        #citirea cheilor publice
        self.merchant_public_key = open("merchant_public.pem").read()
        self.pg_public_key = open("pg_public.pem").read()

        self.sid = ""

    def generate_keys(self):
        #generare rsa
        key = RSA.generate(2048)
        private_key = key.export_key()
        file_out = open("client_private.pem", "wb")
        file_out.write(private_key)
        public_key = key.publickey().export_key()
        file_out = open("client_public.pem", "wb")
        file_out.write(public_key)

    def encrypt_message_aes(self, message, key, nonce):
        cipher_aes = AES.new(key, AES.MODE_EAX, nonce)
        ciphertext = cipher_aes.encrypt(message)
        return ciphertext

    def decrypt_message_aes(self, message, key, nonce):
        cipher_aes = AES.new(key, AES.MODE_EAX, nonce)
        return cipher_aes.decrypt(message)

    def encrypt_message_rsa(self, message, key):
        key = RSA.importKey(key)
        cipher = PKCS1_OAEP.new(key)
        return cipher.encrypt(message)

    def decrypt_message_rsa(self, message, key):
        key = RSA.importKey(key)
        cipher = PKCS1_OAEP.new(key)
        return cipher.decrypt(message)

    def setup(self, ciphertext):
        enc_session_key = self.encrypt_message_rsa(self.merchant_session_key, self.merchant_public_key)
        enc_nonce = self.encrypt_message_rsa(self.merchant_nonce, self.merchant_public_key)
        data = dict()
        data["message"] = base64.b64encode(ciphertext)
        data["key"] = base64.b64encode(enc_session_key)
        data["nonce"] = base64.b64encode(enc_nonce)
        return data

    def send_message(self, url, data):
        headers = {}
        payload = data
        response = requests.request('POST', url, headers=headers, data=payload, allow_redirects=False)
        return response

    def verify_signature(self, message, signature, key):
        key = RSA.importKey(key)
        h = SHA256.new(message)
        verifier = pss.new(key)
        try:
            verifier.verify(h, signature)
            return True
        except (ValueError, TypeError):
            return False

    def sign_message(self, message, key):
        key = RSA.importKey(key)
        h = SHA256.new(message)
        signature = pss.new(key).sign(h)
        return signature

    def generate_nonce(self):
        self.nonce = get_random_bytes(4)


def setup_protocol(client):
    #criptarea mesajului cu cheia publica a clientului
    message = client.public_key.encode()
    #criptarea mesajului cu cheia publica a merchant-ului
    ciphertext = client.encrypt_message_aes(message, client.merchant_session_key, client.merchant_nonce)
    encrypted_data = client.setup(ciphertext)
    #api call
    url = 'http://127.0.0.1:5000/setup'
    response = client.send_message(url, encrypted_data)
    #primirea raspunsul
    response = json.loads(response.json())
    message = response["message"]
    #decodarea raspunsului primit
    message = base64.b64decode(message.encode())
    message_dict = client.decrypt_message_aes(message, client.merchant_session_key, client.merchant_nonce)
    message_dict = json.loads(message_dict)
    sid = message_dict["sid"]
    sid = base64.b64decode(sid.encode())
    signed_sid = message_dict["signed_sid"]
    signed_sid = base64.b64decode(signed_sid.encode())
    authentic = client.verify_signature(sid, signed_sid, client.merchant_public_key)
    if authentic:
        client.sid = sid
        print("SID semnat autentic ".format(sid))
    else:
        print("Semnatura de la SID nu este autentica")
        exit()


def choose_client(client_number):
    #aleg clientul in functie de index
    f = open("clients.json")
    clients = json.load(f)
    f.close()
    pi = dict()
    for index, key in enumerate(clients):
        if index == client_number:
            pi["cardN"] = key
            pi["cardExp"] = clients[key]["cardExp"]
            pi["cCode"] = clients[key]["cCode"]
            pi["amount"] = clients[key]["amount"]
    return pi


def exchange_protocol(client, client_number):
    data = dict()
    pi = choose_client(client_number)
    pi["sid"] = base64.b64encode(client.sid).decode()
    pi["pubKC"] = client.public_key
    client.generate_nonce()
    pi["NC"] = base64.b64encode(client.nonce).decode()
    pi_string = json.dumps(pi)
    pi_string = pi_string.encode()
    pi_signed = client.sign_message(pi_string, client.private_key)

    pm = dict()
    pm["pi"] = pi_string.decode()
    pm["pi_signed"] = base64.b64encode(pi_signed).decode()
    pm_string = json.dumps(pm)
    pm_data = dict()
    message = client.encrypt_message_aes(pm_string.encode(), client.pg_session_key, client.pg_nonce)
    key = client.encrypt_message_rsa(client.pg_session_key, client.pg_public_key)
    nonce = client.encrypt_message_rsa(client.pg_nonce, client.pg_public_key)
    pm_data["message"] = base64.b64encode(message).decode()
    pm_data["key"] = base64.b64encode(key).decode()
    pm_data["nonce"] = base64.b64encode(nonce).decode()
    pm_data_string = json.dumps(pm_data)

    po = dict()
    po["orderDesc"] = "Creion"
    po["sid"] = base64.b64encode(client.sid).decode()
    po["amount"] = 1000
    po_string = json.dumps(po)
    po_string = po_string.encode()
    po_signed = client.sign_message(po_string, client.private_key)
    po["signature"] = base64.b64encode(po_signed).decode()
    po_string = json.dumps(po)

    data["pm"] = pm_data_string
    data["po"] = po_string
    data_string = json.dumps(data).encode()
    data_encrypted = client.encrypt_message_aes(data_string, client.merchant_session_key, client.merchant_nonce)
    data = dict()
    data["message"] = base64.b64encode(data_encrypted).decode()
    key = client.encrypt_message_rsa(client.merchant_session_key, client.merchant_public_key)
    data["key"] = base64.b64encode(key).decode()

    url = 'http://127.0.0.1:5000/exchange'
    response = client.send_message(url, data)
    response = response.json()
    response_json = json.loads(response)
    message = response_json["message"]
    message = base64.b64decode(message.encode())
    message = client.decrypt_message_aes(message, client.merchant_session_key, client.merchant_nonce)
    message_json = json.loads(message.decode())
    response = message_json["response"]
    sid = message_json["sid"]
    sid = base64.b64decode(sid.encode())
    if sid == client.sid:
        print("SID-ul din raspuns corespunde")
    signature = message_json["signed"]
    signature = base64.b64decode(signature.encode())
    to_verify = str(response) + message_json["sid"] + str(po["amount"]) + pi["NC"]
    authentic = client.verify_signature(to_verify.encode(), signature, client.pg_public_key)
    if authentic:
        print("Raspunsul din tranzactie este semnat autentic")

    if response == True:
        print("Tranzactia a avut loc")
        transaction_complete(client_number, po["amount"])
    else:
        print("Tranzactia nu a putut avea loc")


def transaction_complete(client_number, amount):
    f = open("clients.json")
    clients = json.load(f)
    f.close()
    for index, key in enumerate(clients):
        if index == client_number:
            clients[key]["amount"] -= amount

    f = open("clients.json", "w")
    json.dump(clients, f)
    f.close()


if __name__ == '__main__':
    client = Client()
    setup_protocol(client)
    exchange_protocol(client, 0)
