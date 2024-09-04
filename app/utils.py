from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

from cryptography.fernet import Fernet


from app.models import User
from app.schemas import UserResponse

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

pwd_context = CryptContext(schemes=["bcrypt"])


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def convert_user_to_user_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        is_active=user.is_active,
        phone_number=user.phone_number
    )

def generate_key():
    return Fernet.generate_key()

# Encrypt the string
def encrypt_string(key: bytes, plaintext: str) -> str:
    fernet = Fernet(key)
    encrypted = fernet.encrypt(plaintext.encode())
    return encrypted.decode()

# Decrypt the string
def decrypt_string(key: bytes, encrypted_text: str) -> str:
    fernet = Fernet(key)
    decrypted = fernet.decrypt(encrypted_text.encode())
    return decrypted.decode()