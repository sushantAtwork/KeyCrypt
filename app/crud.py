from sqlalchemy.orm import Session

from app.utils import hash_password, verify_password
from . import models, schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if db_user is None:
        return None
    else:
        return db_user


def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserRequest):
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.hashed_password),
        is_active=user.is_active,
        phone_number=user.phone_number)
    print(db_user)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def user_login(db: Session, user: schemas.UserLogin):
    db = get_user_by_email(db, user.email)
    print(f'DB user here in crud.py : {db}')

    if db is None:
        raise Exception("User not exist")
    else:
        if verify_password(user.password, db.hashed_password):
            return db
        else:
            return None


def get_keys_by_user(db: Session, user_id: int):
    return db.query(models.Key).filter(models.Key.user_id == user_id).all()


def create_key(db: Session, key: schemas.KeyRequest, user_id: int):
    db_key = models.Key(**key.dict(), user_id=user_id)
    db.add(db_key)
    db.commit()
    db.refresh(db_key)
    return db_key


def delete_key(db: Session, key_id: int):
    key = db.query(models.Key).filter(models.Key.id == key_id).first()
    if key:
        db.delete(key)
        db.commit()
        return key
    return None
