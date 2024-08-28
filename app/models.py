from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "user"  # Table name is 'user'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))
    is_active = Column(Boolean, default=True)
    phone_number = Column(String(50))

    # Relationship with the Key model
    keys = relationship("Key", back_populates="user")


class Key(Base):
    __tablename__ = "keys"  # Table name is 'keys'

    id = Column(Integer, primary_key=True, index=True)
    key_name = Column(String(50), index=True)
    key_value = Column(String(255))
    key_type = Column(String(255))

    # Correct ForeignKey reference
    user_id = Column(Integer, ForeignKey('user.id'))  # ForeignKey references 'user.id'

    # Relationship with the User model
    user = relationship("User", back_populates="keys")
