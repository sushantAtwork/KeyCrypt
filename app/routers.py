from typing import Dict

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas, crud
from app.auth import generate_token
from app.auth import get_current_user
from app.database import get_db
from app.exception import MissingKeyFieldException
from app.utils import convert_user_to_user_response

router = APIRouter(
    prefix="/user",
    tags=["user"]
)


#### USERS

@router.post("/add")
def create_user(user: schemas.UserRequest, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    print(db_user)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    created_user = crud.create_user(db, user)
    user_response = convert_user_to_user_response(created_user)
    token = generate_token({'sub': user.email})
    return {"response": user_response, "token": token}


@router.post("/login")
def user_login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User Not Found")
    else:
        user = crud.user_login(db, user)
        if user is None:
            return None
        else:
            token = generate_token({'sub': user.email})
            user_response = convert_user_to_user_response(user)
    return {"response": user_response, "token": token}


# Will uncomment it later

# @router.get("/", response_model=List[schemas.UserResponse])
# def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
#     users = crud.get_users(db, skip=skip, limit=limit)
#     return users


# Will uncomment it later

# @router.get("/{user_id}", response_model=schemas.UserResponse)
# def read_user(user_id: int, db: Session = Depends(get_db)):
#     db_user = crud.get_user(db, user_id=user_id)
#     if db_user is None:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
#     return db_user


@router.put("/update/{user_id}")
def update_user(
        user: schemas.UserRequest,
        db: Session = Depends(get_db),
        token: Dict = Depends(get_current_user)):
    try:
        print(token)
        db_user = crud.update_user(user_email=token.email, user_update=user, db=db)
        if db_user is None:
            raise Exception
        else:
            return {"message": "User Updated Successfully!!!"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error caused {e}")


##### KEYS

@router.post("/add/keys/")
def create_key_for_user(
        key_req: schemas.KeyRequest,
        db: Session = Depends(get_db),
        token: Dict = Depends(get_current_user)
):
    try:
        crud.create_key(db=db, key=key_req, user_email=token.email)
    except MissingKeyFieldException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'{e}')
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f'Something went wrong {e}')
    return {"message": "Key created successfully"}


@router.get("/get/keys")
def read_keys(db: Session = Depends(get_db),
              token: Dict = Depends(get_current_user)):
    try:
        keys = crud.get_keys_by_user(db, user_email=token.email)
        if not keys:
            return {"response": keys}
    except Exception as e:
        raise e
    return {"response": keys}


@router.delete("/delete/keys/{key_id}")
def delete_key(key_id: int,
               db: Session = Depends(get_db),
               token: Dict = Depends(get_current_user)):
    try:
        db_key = crud.delete_key(db=db, key_id=key_id, user_email=token.email)
        if db_key is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Key not found")
    except MissingKeyFieldException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'{e}')
    return {"key": db_key, "status": "deleted"}
