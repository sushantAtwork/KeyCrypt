from fastapi import FastAPI

import app.models
from app.routers import router
from app.database import engine

app2 = FastAPI()

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

# this will create tables
app.models.Base.metadata.create_all(engine)

app2.include_router(router)
