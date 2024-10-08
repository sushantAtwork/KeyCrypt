from sqlalchemy.orm import Session

from app.encryptionUtils import EncryptionUtil
from app.utils import (
    hash_password,
    verify_password,
    get_current_date_time,
    validateEmail,
    validatePassword,
)
from app.auth import verify_token
from . import models, schemas
from .exception import MissingKeyFieldException, InvalidValidation, EntityNotExist

crypt = EncryptionUtil()


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def authorize_user(token: str):
    try:
        tokenData = verify_token(token=token)
        if tokenData is None:
            return False
        else:
            return True
    except:
        return False


def get_user_by_email(db: Session, email: str):
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if db_user is None:
        return None
    else:
        return db_user


def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserRequest):
    if (
        user.email is ""
        or user.username is ""
        or user.hashed_password is ""
        or user.phone_number is ""
    ):
        raise MissingKeyFieldException(
            "One or more required fields (email, username, password, phone_number) are missing."
        )
    if validateEmail(user.email) is False:
        raise InvalidValidation("Email is not validated!!!!")
    if validatePassword(user.hashed_password) is False:
        raise InvalidValidation("Password is not validated!!!!")
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.hashed_password),
        is_active=True,
        phone_number=user.phone_number,
        created_at=get_current_date_time(),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_email: str, user_update: schemas.UserRequest):
    user = get_user_by_email(db=db, email=user_email)
    if user is None:
        raise EntityNotExist("User not exist!!!!!")
    else:
        if validatePassword(user_update.hashed_password) is False:
            raise InvalidValidation("Password is not validated!!!!")
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
        raise EntityNotExist("User not exist")
    else:
        if verify_password(user.password, db_user.hashed_password):
            return db_user
        else:
            raise Exception("Invalid Credentials!!")


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
                # saved_key.value = key.key_value
                saved_key.updated_at = key.updated_at
                saved_key.created_at = key.created_at
                key_list.append(saved_key)
    except Exception as e:
        raise e
    return key_list


def get_key_by_id(db: Session, key_id: int):
    try:
        key = db.query(models.Key).filter(models.Key.id == key_id).first()
        if not key:
            raise ValueError(f"No key found with id {key_id}")
        return key
    except Exception as e:
        print(f"An error occurred while fetching the key: {e}")
        raise e


def create_key(db: Session, key: schemas.KeyRequest, user_email: str):
    try:
        # Fetch user by email
        user = get_user_by_email(db=db, email=user_email)
        if user is None:
            raise Exception("User not found.")

        # Validate required fields
        if not key.key or not key.value or not key.type:
            raise MissingKeyFieldException(
                "One or more required fields (key, value, type) are missing."
            )

        # Create a new key entry
        current_time = get_current_date_time()  # Get the current time for both fields
        db_key = models.Key(
            key_name=key.key,
            key_value=crypt.encrypt(key.value),
            key_type=key.type,
            user_id=user.id,
            created_at=current_time,
            updated_at=current_time,  # Set updated_at
        )

        # Add and commit the new key to the database
        db.add(db_key)
        db.commit()
        db.refresh(db_key)

        # Prepare the response
        key_response = schemas.KeyResponse(
            id=db_key.id,
            key=db_key.key_name,
            value=db_key.key_value,
            type=db_key.key_type,
            created_at=db_key.created_at,  # Use db_key created_at
            updated_at=(
                db_key.updated_at if db_key.updated_at else current_time
            ),  # Ensure updated_at is valid
        )

        return key_response

    except MissingKeyFieldException as e:
        print(f"Validation error: {e}")
        raise

    except Exception as e:
        print("An error occurred during key creation.")
        db.rollback()
        print(f"Error details: {e}")
        raise


def update_key(db: Session, key_id: int, key: schemas.KeyRequest, user_email: str):
    try:
        saved_key = get_key_by_id(db=db, key_id=key_id)
        db_user = get_user_by_email(db=db, email=user_email)
        if db_user is None:
            raise EntityNotExist("User does'nt exist!!!")
        if key.key is "" or key.value is "" or key.type is "":
            raise MissingKeyFieldException(
                "One or more required fields (key, value, type) are missing."
            )
        if saved_key is None:
            raise EntityNotExist("Key not found!!!!")
        else:
            saved_key.key_name = key.key
            saved_key.key_value = crypt.encrypt(key.value)
            saved_key.key_type = key.type
            saved_key.user_id = db_user.id
            saved_key.updated_at = get_current_date_time()

            db.add(saved_key)
            db.commit()
            db.refresh(saved_key)

        key_response = schemas.KeyResponse(
            id=saved_key.id,
            key=saved_key.key_name,
            value=saved_key.key_value,
            type=saved_key.key_type,
            created_at=saved_key.created_at,
            updated_at=(
                saved_key.updated_at if saved_key.updated_at else current_time
            ),
        )
        return key_response
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise Exception(f"Error in updating keys : {e}")


def delete_key(db: Session, key_id: int, user_email: str):
    user = get_user_by_email(db=db, email=user_email)
    if user is None:
        raise EntityNotExist("User not exist!!!!")
    else:
        if key_id is "":
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
