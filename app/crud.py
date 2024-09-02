from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.encryptionUtils import EncryptionUtil
from app.utils import (
    hash_password,
    verify_password,
    get_current_date_time
)
from . import models, schemas
from .exception import MissingKeyFieldException

crypt = EncryptionUtil()


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
    if user.email is '' or user.username is '' or user.hashed_password is '' or user.phone_number is '':
        raise MissingKeyFieldException(
            "One or more required fields (email, username, password, phone_number) are missing.")
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.hashed_password),
        is_active=True,
        phone_number=user.phone_number,
        created_at=get_current_date_time()
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_email: str, user_update: schemas.UserRequest):
    user = get_user_by_email(db=db, email=user_email)
    if user is None:
        raise Exception
    else:
        user.username = user_update.username
        user.email = user_update.email
        user.hashed_password = hash_password(user_update.hashed_password)
        user.phone_number = user_update.phone_number
        user.updated_at = get_current_date_time()
        try:
            db.commit()
            db.refresh(user)
        except Exception as e:
            db.rollback()
            print(f"Error updating user: {e}")
    return user


def user_login(db: Session, user: schemas.UserLogin):
    db_user = get_user_by_email(db, user.email)
    if db_user is None:
        raise Exception("User not exist")
    else:
        if verify_password(user.password, db_user.hashed_password):
            return db_user
        else:
            return None


def get_keys_by_user(db: Session, user_email: str):
    key_list = []
    try:
        user = get_user_by_email(db=db, email=user_email)
        if not user:
            raise ValueError(f"No user found with email {user_email}")
        else:
            db_keys = db.query(models.Key).filter(models.Key.user_id == user.id).all()
            for key in db_keys:
                saved_key = models.Key()
                saved_key.id = key.id
                saved_key.name = key.key_name
                saved_key.value = crypt.decrypt(key.key_value)
                key_list.append(saved_key)
    except Exception as e:
        raise e
    return key_list


def get_key_by_id(db: Session, key_id: int):
    try:
        key = db.query(models.Key).filter(models.Key.id == key_id).first()
        if not key:
            raise ValueError(f"No key found with id {key_id}")
        decrypted_key = {
            "id": key.id,
            "name": key.key_name,
            "value": crypt.decrypt(key.key_value),
            "type": key.key_type
        }
        return decrypted_key
    except Exception as e:
        print(f"An error occurred while fetching the key: {e}")
        raise e


def create_key(db: Session, key: schemas.KeyRequest, user_email: str):
    user = get_user_by_email(db=db, email=user_email)
    if user is None:
        raise Exception
    else:
        if key.key is '' or key.value is '' or key.type is '':
            raise MissingKeyFieldException("One or more required fields (key, value, type) are missing.")
        db_key = models.Key(
            key_name=key.key,
            key_value=crypt.encrypt(key.value),
            key_type=key.type,
            user_id=user.id,
            created_at=get_current_date_time()
        )
    try:
        db.add(db_key)
        db.commit()
        db.refresh(db_key)
        key_response = schemas.KeyResponse(
            id=db_key.id,
            key=db_key.key_name,
            value=db_key.key_value,
            type=db_key.key_type,
        )
        return key_response
    except Exception as e:
        db.rollback()
        print(f"error {e}")
        raise


# def update_key(db: Session, key_id: int, key: schemas.KeyRequest, user_email: str):
#     saved_key = get_key_by_id(db=db, key_id=key_id)
#     db_user = get_user_by_email(db=db, email=user_email)
#     if db_user is None:
#         raise Exception
#     else:
#         if key.key is '' or key.value is '' or key.type is '':
#             raise MissingKeyFieldException("One or more required fields (key, value, type) are missing.")
#         else:
#             print(f'{saved_key} adsad {key}' )
#             saved_key.key_name = key.key_name
#             saved_key.key_value = crypt.encrypt(key.value)
#             saved_key.key_type = key.type
#             saved_key.user_id = db_user.id
#             saved_key.updated_at = get_current_date_time()
#     try:
#         db.add(saved_key)
#         db.commit()
#         db.refresh(saved_key)
#         key_response = schemas.KeyResponse(
#             id=saved_key.id,
#             key=saved_key.key_name,
#             value=saved_key.key_value,
#             type=saved_key.key_type,
#         )
#         return key_response
#     except Exception as e:
#         db.rollback()
#         print(f"error {e}")
#         raise

def update_key(db: Session, key_id: int, key: schemas.KeyRequest, user_email: str):
    saved_key = get_key_by_id(db=db, key_id=key_id)
    db_user = get_user_by_email(db=db, email=user_email)

    if db_user is None:
        raise

    if not key.key_name or not key.value or not key.type:
        raise MissingKeyFieldException("One or more required fields (key, value, type) are missing.")

    if saved_key is None:
        raise

    # Correct the field updates and remove trailing commas
    saved_key.key_name = key.key_name
    saved_key.key_value = crypt.encrypt(key.value)
    saved_key.key_type = key.type
    saved_key.user_id = db_user.id
    saved_key.updated_at = get_current_date_time()

    try:
        db.add(saved_key)
        db.commit()
        db.refresh(saved_key)

        # Correct attribute names for KeyResponse
        key_response = schemas.KeyResponse(
            id=saved_key.id,
            key=saved_key.key_name,
            value=saved_key.key_value,
            type=saved_key.key_type,
        )
        return key_response
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise


def delete_key(db: Session, key_id: int, user_email: str):
    user = get_user_by_email(db=db, email=user_email)
    if user is None:
        raise Exception
    else:
        if key_id is '':
            raise MissingKeyFieldException("Key ID is missing.")
        else:
            key_exist = get_key_by_id(db=db, key_id=key_id)
            if key_exist:
                key = db.query(models.Key).filter(models.Key.id == key_id).first()
                if key:
                    db.delete(key)
                    db.commit()
                    return key
    return None
