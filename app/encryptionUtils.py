import base64

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.padding import PKCS7


class EncryptionUtil:
    def __init__(self):
        self.key = b'1234567812345678'  # 16-byte key for AES-128
        self.init_vector = b'1234567812345678'  # 16-byte IV for CBC mode
        self.algo = algorithms.AES(self.key)
        self.backend = default_backend()

    def encrypt(self, value: str) -> str:
        try:
            # Initialize cipher for encryption
            cipher = Cipher(self.algo, modes.CBC(self.init_vector), backend=self.backend)
            encryptor = cipher.encryptor()

            # Padding the input value
            padder = PKCS7(128).padder()
            padded_data = padder.update(value.encode('utf-8')) + padder.finalize()

            # Encrypt the data
            encrypted = encryptor.update(padded_data) + encryptor.finalize()

            # Encode in Base64 for safe transmission
            return base64.b64encode(encrypted).decode('utf-8')
        except Exception as ex:
            print(f"Encryption error: {ex}")
            return None

    def decrypt(self, encrypted: str) -> str:
        try:
            # Decode from Base64
            encrypted_data = base64.b64decode(encrypted)

            # Initialize cipher for decryption
            cipher = Cipher(self.algo, modes.CBC(self.init_vector), backend=self.backend)
            decryptor = cipher.decryptor()

            # Decrypt the data
            decrypted_padded = decryptor.update(encrypted_data) + decryptor.finalize()

            # Unpad the decrypted data
            unpadder = PKCS7(128).unpadder()
            decrypted = unpadder.update(decrypted_padded) + unpadder.finalize()

            return decrypted.decode('utf-8')
        except Exception as ex:
            print(f"Decryption error: {ex}")
            return None