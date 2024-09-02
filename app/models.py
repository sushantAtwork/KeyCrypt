from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))
    is_active = Column(Boolean, default=True)
    phone_number = Column(String(50))

    keys = relationship("Key", back_populates="user")
    updated_at = Column(String(50))
    created_at = Column(String(50))


class Key(Base):
    __tablename__ = "keys"

    id = Column(Integer, primary_key=True, index=True)
    key_name = Column(String(50), index=True)
    key_value = Column(String(255))
    key_type = Column(String(255))

    user_id = Column(Integer, ForeignKey('user.id'))
    updated_at = Column(String(50))
    created_at = Column(String(50))

    user = relationship("User", back_populates="keys")
