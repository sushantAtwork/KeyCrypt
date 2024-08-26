from pydantic import BaseModel


class UserLogin(BaseModel):
    email: str
    password: str

    class Config():
        orm_mode = True


class UserResponse(BaseModel):
    username: str
    email: str
    is_active: bool
    phone_number: str

    class Config():
        orm_mode = True


class UserRequest(BaseModel):
    username: str
    email: str
    hashed_password: str
    is_active: bool
    phone_number: str

    class Config():
        orm_mode = True


class KeyRequest(BaseModel):
    key: str
    value: str


class KeyResponse(BaseModel):
    id: int
    key: str
    value: str

    class Config():
        orm_mode = True
