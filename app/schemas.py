from typing import Optional

from pydantic import BaseModel


class UserLogin(BaseModel):
    email: str
    password: str

    class Config():
        orm_mode = True


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    phone_number: str

    class Config():
        orm_mode = True


class UserRequest(BaseModel):
    username: str
    email: str
    hashed_password: str
    phone_number: str

    class Config():
        orm_mode = True


class KeyRequest(BaseModel):
    key: str
    value: str
    type: str

    class Config():
        orm_mode = True
        from_attributes = True


class KeyResponse(BaseModel):
    id: int
    key: str
    value: str
    type: str

    class Config():
        orm_mode = True
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
