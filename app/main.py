import uvicorn
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.security import OAuth2PasswordBearer

from app import models
from app.database import engine
from app.routers import router

app = FastAPI()

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Create the custom OpenAPI schema
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="KeyCrypt",
        version="1.2.0",
        description="This is a custom OpenAPI schema for KeyCrypt",
        routes=app.routes,
    )
    # here security scheme is defined
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "JWT Authorization header using the Bearer scheme. Example: 'Authorization: Bearer {token}'",
        }
    }
    openapi_schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


# creates database
@app.on_event("startup")
def on_startup():
    models.Base.metadata.create_all(bind=engine)


# Include the routers
app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
