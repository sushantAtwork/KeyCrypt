from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas, crud
from app.auth import generate_token, get_current_user
from app.database import get_db
from app.utils import convert_user_to_user_response

router = APIRouter(
    prefix="/user",
    tags=["user"]
)



#### USERS

@router.post("/add")
def create_user(user: schemas.UserRequest, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    created_user = crud.create_user(db, user)
    user_response = convert_user_to_user_response(created_user)
    token = generate_token({'sub': user.email})
    return {"response": user_response, "token": token}


@router.post("/")
def user_login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user == None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User Not Found")
    else:
        user = crud.user_login(db, user)
        if user is None:
            return None
        else:
            token = generate_token({'sub': user.email})
            user_response = convert_user_to_user_response(user)
    return {"response": user_response, "token": token}


@router.get("/", response_model=List[schemas.UserResponse])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=schemas.UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user


##### KEYS


@router.post("/{user_id}/keys/")
def create_key_for_user(user_id: int, key_req: schemas.KeyRequest, db: Session = Depends(get_db)):
    try:
        crud.create_key(db=db, key=key_req, user_id=user_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f'Something went wrong {e}')
    return {"message": "Key created successfully"}


@router.get("/{user_id}/keys/")
def read_keys(user_id: int, db: Session = Depends(get_db)):
    try:
        keys = crud.get_keys_by_user(db, user_id=user_id)
        if not keys:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Keys not found")
    except Exception as e:
        raise e
    return keys


@router.delete("/keys/{key_id}")
def delete_key(key_id: int, db: Session = Depends(get_db)):
    db_key = crud.delete_key(db=db, key_id=key_id)
    if db_key is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Key not found")
    return {"key": db_key, "status": "deleted"}
