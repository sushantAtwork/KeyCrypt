import re
from datetime import datetime

from cryptography.fernet import Fernet
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

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


def get_current_date_time():
    current_datetime = datetime.now()
    return current_datetime.strftime("%d-%m-%Y %H:%M:%S")


def validateEmail(email: str) -> bool:
    # Define the regular expression for a valid email address
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    # Use re.match() to check if the email matches the pattern
    if re.match(email_regex, email):
        return True
    else:
        return False


def validatePassword(password: str) -> bool:
    # Define the regular expression for a valid password
    password_regex = (
        r'^(?=.*[a-z])'  # At least one lowercase letter
        r'(?=.*[A-Z])'  # At least one uppercase letter
        r'(?=.*\d)'  # At least one digit
        r'(?=.*[@$!%*?&])'  # At least one special character
        r'[A-Za-z\d@$!%*?&]{8,}$'  # Minimum 8 characters long
    )

    # Use re.match() to check if the password matches the pattern
    if re.match(password_regex, password):
        return True
    else:
        return False
