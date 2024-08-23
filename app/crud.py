from sqlalchemy.orm import Session

from . import models, schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserRequest):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(username=user.username, email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_keys_by_user(db: Session, user_id: int):
    return db.query(models.Key).filter(models.Key.owner_id == user_id).all()


def create_key(db: Session, key: schemas.KeyRequest, user_id: int):
    db_key = models.Key(**key.dict(), owner_id=user_id)
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
