from passlib.context import CryptContext

from app.schemas import UserResponse
from app.models import User

# Create a CryptContext object
pwd_context = CryptContext(schemes=["bcrypt"])


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def convert_user_to_user_response(user: User) -> UserResponse:
    print(user.id)
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        is_active=user.is_active,
        phone_number=user.phone_number
    )
