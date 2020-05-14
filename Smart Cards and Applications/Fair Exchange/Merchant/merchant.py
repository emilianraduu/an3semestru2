import base64
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes
from Crypto.PublicKey import RSA
from flask import Flask, request, jsonify
from Crypto.Signature import pss
from Crypto.Hash import SHA256
import json
import requests


class Merchant:
    def __init__(self):
        self.client_session_key = ''
        self.client_nonce = ''
        self.client_public_key = ''
        self.sid = get_random_bytes(4)
        self.private_key = open("merchant_private.pem").read()
        self.pg_session_key = get_random_bytes(16)
        cipher_aes = AES.new(self.pg_session_key, AES.MODE_EAX)
        self.pg_nonce = cipher_aes.nonce
        self.pg_public_key = open("pg_public.pem").read()

    def generate_keys(self):
        key = RSA.generate(2048)
        private_key = key.export_key()
        file_out = open("merchant_private.pem", "wb")
        file_out.write(private_key)

        public_key = key.publickey().export_key()
        file_out = open("merchant_public.pem", "wb")
        file_out.write(public_key)

    def sign_message(self, message, key):
        key = RSA.importKey(key)
        h = SHA256.new(message)
        signature = pss.new(key).sign(h)
        return signature

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

    def verify_signature(self, message, signature, key):
        key = RSA.importKey(key)
        h = SHA256.new(message)
        verifier = pss.new(key)
        try:
            verifier.verify(h, signature)
            return True
        except (ValueError, TypeError):
            return False

    def send_message(self, url, data):
        headers = {}
        payload = data
        response = requests.request('POST', url, headers=headers, data=payload, allow_redirects=False)
        return response

    def setup(self, rec_data):
        aes_encrypted_key = base64.b64decode(rec_data["key"])
        self.client_session_key = self.decrypt_message_rsa(aes_encrypted_key, self.private_key)
        nonce = base64.b64decode(rec_data["nonce"])
        self.client_nonce = self.decrypt_message_rsa(nonce, self.private_key)
        ciphertext = base64.b64decode(request.form["message"])
        data = self.decrypt_message_aes(ciphertext, self.client_session_key, self.client_nonce)
        self.client_public_key = data.decode()

        rec_data = dict()
        rec_data["sid"] = base64.b64encode(self.sid).decode()
        signed_sid = self.sign_message(self.sid, self.private_key)
        rec_data["signed_sid"] = base64.b64encode(signed_sid).decode()
        message_string = json.dumps(rec_data).encode()
        enc_message = self.encrypt_message_aes(message_string, self.client_session_key, self.client_nonce)
        data = dict()
        data["message"] = base64.b64encode(enc_message).decode()
        return data

    def exchange(self, rec_data):
        message = rec_data["message"]
        message = message.encode()
        message = base64.b64decode(message)
        message = self.decrypt_message_aes(message, self.client_session_key, self.client_nonce)
        message_json = json.loads(message.decode())
        pm = message_json["pm"]
        po = message_json["po"]
        po = json.loads(po)

        signature = po["signature"].encode()
        signature = base64.b64decode(signature)
        del po["signature"]
        po_string = json.dumps(po)
        authentic = self.verify_signature(po_string.encode(), signature, self.client_public_key)
        if authentic:
            print("PO semnat autentic")
        else:
            print("Semnatura de la PO nu este autentica ")
            exit()

        amount = po["amount"]
        to_be_signed = base64.b64encode(self.sid).decode()
        to_be_signed = to_be_signed + self.client_public_key
        to_be_signed = to_be_signed + str(amount)
        signed = self.sign_message(to_be_signed.encode(), self.private_key)

        data = dict()
        pg_data = dict()
        pg_data["pm"] = pm
        pg_data["signature"] = base64.b64encode(signed).decode()
        pg_data_string = json.dumps(pg_data)
        pg_data_enc = self.encrypt_message_aes(pg_data_string.encode(), self.pg_session_key, self.pg_nonce)
        data["message"] = base64.b64encode(pg_data_enc).decode()
        key = self.encrypt_message_rsa(self.pg_session_key, self.pg_public_key)
        nonce = self.encrypt_message_rsa(self.pg_nonce, self.pg_public_key)
        data["key"] = base64.b64encode(key).decode()
        data["nonce"] = base64.b64encode(nonce).decode()
        amount = str(amount)
        amount = self.encrypt_message_rsa(amount.encode(), self.pg_public_key)
        data["amount"] = base64.b64encode(amount).decode()
        url = "http://127.0.0.1:5001/exchange"
        response = self.send_message(url, data)

        response = response.json()
        response = json.loads(response)
        message = response["message"]
        message = base64.b64decode(message.encode())
        message = self.decrypt_message_aes(message, self.pg_session_key, self.pg_nonce)
        message = message.decode()
        message_json = json.loads(message)

        data = dict()
        data["response"] = message_json["response"]
        data["sid"] = message_json["sid"]
        data["signed"] = message_json["signed"]

        data_string = json.dumps(data)
        data_enc = self.encrypt_message_aes(data_string.encode(), self.client_session_key, self.client_nonce)
        key = self.encrypt_message_rsa(self.client_session_key, self.client_public_key)
        data = dict()
        data["message"] = base64.b64encode(data_enc).decode()
        data["key"] = base64.b64encode(key).decode()
        return data


app = Flask(__name__)


@app.route('/setup', methods=['POST', 'OPTIONS'])
def Setup():
    data = merchant.setup(request.form)
    return jsonify(json.dumps(data)), 200


@app.route('/exchange', methods=['POST', 'OPTIONS'])
def Exchange():
    data = merchant.exchange(request.form)
    return jsonify(json.dumps(data)), 200


if __name__ == "__main__":
    merchant = Merchant()
    app.run(debug=True)
