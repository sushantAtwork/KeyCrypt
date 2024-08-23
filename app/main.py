from fastapi import FastAPI

import app.models
from app.database import engine

app2 = FastAPI()

# this will create tables
app.models.Base.metadata.create_all(engine)


@app2.post("")
def first():
    return {"message": "working"}
