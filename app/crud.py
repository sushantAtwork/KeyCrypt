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
        is_active=True,
        phone_number=user.phone_number)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: int, user_update: schemas.UserRequest):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.username = user_update.username
    db_user.email = user_update.email
    db_user.hashed_password = hash_password(user_update.hashed_password)
    db_user.phone_number = user_update.phone_number
    try:
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        print(f'Error updating user: {e}')
    return db_user


def user_login(db: Session, user: schemas.UserLogin):
    db_user = get_user_by_email(db, user.email)
    if db_user is None:
        raise Exception("User not exist")
    else:
        if verify_password(user.password, db_user.hashed_password):
            return db_user
        else:
            return None


def get_keys_by_user(db: Session, user_id: int):
    try:
        db_keys = db.query(models.Key).filter(models.Key.user_id == user_id).all()
    except Exception as e:
        raise e
    return db_keys


def create_key(db: Session, key: schemas.KeyRequest, user_id: int):
    db_key = models.Key(
        key_name=key.key,
        key_value=key.value,
        key_type=key.type,
        user_id=user_id
    )
    try:
        db.add(db_key)
        db.commit()
        db.refresh(db_key)
        key_response = schemas.KeyResponse(
            id=db_key.id,
            key=db_key.key_name,
            value=db_key.key_value,
            type=db_key.key_type
        )
        return key_response
    except Exception as e:
        db.rollback()
        print(f'error {e}')
        raise


def delete_key(db: Session, key_id: int):
    key = db.query(models.Key).filter(models.Key.id == key_id).first()
    if key:
        db.delete(key)
        db.commit()
        return key
    return None
