import base64
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA
from flask import Flask, request, jsonify
from Crypto.Signature import pss
from Crypto.Hash import SHA256
import json
import time


def decrypt_message_rsa(message, key):
    key = RSA.importKey(key)
    cipher = PKCS1_OAEP.new(key)
    return cipher.decrypt(message)


def verify_signature(message, signature, key):
    key = RSA.importKey(key)
    h = SHA256.new(message)
    verifier = pss.new(key)
    try:
        verifier.verify(h, signature)
        return True
    except (ValueError, TypeError):
        return False


def encrypt_message_rsa(message, key):
    key = RSA.importKey(key)
    cipher = PKCS1_OAEP.new(key)
    return cipher.encrypt(message)


def decrypt_message_aes(message, key, nonce):
    cipher_aes = AES.new(key, AES.MODE_EAX, nonce)
    return cipher_aes.decrypt(message)


def encrypt_message_aes(message, key, nonce):
    cipher_aes = AES.new(key, AES.MODE_EAX, nonce)
    ciphertext = cipher_aes.encrypt(message)
    return ciphertext


def sign_message(message, key):
    key = RSA.importKey(key)
    h = SHA256.new(message)
    signature = pss.new(key).sign(h)
    return signature


def generate_keys():
    key = RSA.generate(2048)
    private_key = key.export_key()
    file_out = open("pg_private.pem", "wb")
    file_out.write(private_key)

    public_key = key.publickey().export_key()
    file_out = open("pg_public.pem", "wb")
    file_out.write(public_key)


class PG:
    def __init__(self):
        self.merchant_public_key = open("merchant_public.pem").read()
        self.merchant_session_key = ''
        self.merchant_nonce = ''
        self.client_public_key = ''
        self.client_session_key = ''
        self.client_nonce = ''
        self.private_key = open("pg_private.pem").read()

    def exchange(self, rec_data):
        message = rec_data["message"]
        key = rec_data["key"]
        nonce = rec_data["nonce"]
        amount = rec_data["amount"]
        amount = base64.b64decode(amount.encode())
        amount = decrypt_message_rsa(amount, self.private_key)
        order_amount = int(amount)
        key = base64.b64decode(key.encode())
        nonce = base64.b64decode(nonce.encode())
        self.merchant_session_key = decrypt_message_rsa(key, self.private_key)
        self.merchant_nonce = decrypt_message_rsa(nonce, self.private_key)

        message = base64.b64decode(message.encode())
        message = decrypt_message_aes(message, self.merchant_session_key, self.merchant_nonce)
        message_json = json.loads(message.decode())
        pm_data_string = message_json["pm"]
        pm_data = json.loads(pm_data_string)
        signature = message_json["signature"]
        merchant_signature = base64.b64decode(signature.encode())
        client_key = base64.b64decode(pm_data["key"].encode())
        client_nonce = base64.b64decode(pm_data["nonce"].encode())
        self.client_session_key = decrypt_message_rsa(client_key, self.private_key)
        self.client_nonce = decrypt_message_rsa(client_nonce, self.private_key)
        message = base64.b64decode(pm_data["message"].encode())
        pm = decrypt_message_aes(message, self.client_session_key, self.client_nonce)
        pm = json.loads(pm)
        pi_string = pm["pi"]
        pi = json.loads(pi_string)
        self.client_public_key = pi["pubKC"]
        signature = base64.b64decode(pm["pi_signed"].encode())
        authentic = verify_signature(pi_string.encode(), signature, self.client_public_key)
        if authentic:
            print("PI semnat autentic")
        else:
            print("Semnatura de la PI nu este autentica")
            exit()
        to_verify = pi["sid"]
        to_verify = to_verify + self.client_public_key
        to_verify = to_verify + str(order_amount)

        authentic = verify_signature(to_verify.encode(), merchant_signature, self.merchant_public_key)
        if authentic:
            print("Semnatura de la merchant este autentica")
        else:
            print("Semnatura de la merchant nu este autentica")
            exit()

        payment_completed = verify_payment(pi, order_amount)
        data = dict()
        data["response"] = payment_completed
        data["sid"] = pi["sid"]
        to_sign = str(payment_completed) + pi["sid"] + str(order_amount) + pi["NC"]
        signed = sign_message(to_sign.encode(), self.private_key)
        data["signed"] = base64.b64encode(signed).decode()
        data_string = json.dumps(data)
        data_string_enc = encrypt_message_aes(data_string.encode(), self.merchant_session_key, self.merchant_nonce)

        data = dict()
        data["message"] = base64.b64encode(data_string_enc).decode()
        key = encrypt_message_rsa(self.merchant_session_key, self.merchant_public_key)
        data["key"] = base64.b64encode(key).decode()
        return data


def verify_payment(pi, order_amount):
    f = open("clients.json")
    clients = json.load(f)
    f.close()
    client = clients.get(pi["cardN"], 0)
    if client == 0:
        print("Clientul nu exista")
        return False
    if client["cardExp"] != pi["cardExp"]:
        print("Date incorecte")
        return False
    if client["cCode"] != pi["cCode"]:
        print("Challenge cod gresit")
        return False
    if int(time.time()) > client["cardExp"]:
        print("Card expirat")
        return False
    if order_amount > client["amount"]:
        print("Fonduri insuficiente")
        return False
    clients[pi["cardN"]]["amount"] -= order_amount
    f = open("clients.json", "w")
    json.dump(clients, f)
    f.close()
    return True


app = Flask(__name__)


@app.route('/exchange', methods=['POST', 'OPTIONS'])
def Exchange():
    data = pg.exchange(request.form)
    return jsonify(json.dumps(data)), 200


if __name__ == "__main__":
    pg = PG()
    app.run(debug=True, port=5001)
