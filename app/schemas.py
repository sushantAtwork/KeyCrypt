from pydantic import BaseModel


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    hashed_password: str
    is_active: bool
    phone_number: int


class UserRequest(BaseModel):
    username: str
    email: str
    hashed_password: str
    is_active: bool
    phone_number: int


class KeyRequest(BaseModel):
    key: str
    value: str


class KeyResponse(BaseModel):
    id: int
    key: str
    value: str

    class Config:
        orm_mode = True
