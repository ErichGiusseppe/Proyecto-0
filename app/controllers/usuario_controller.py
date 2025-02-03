from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.response_wrapper import api_response
from model.models import Tarea, User
from db.database import get_db
from datetime import timedelta, datetime, timezone
from typing import Annotated
from pydantic import BaseModel, Field
from starlette import status 
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt,JWTError


router = APIRouter()

SECRET_KEY= "clave_secreta_pa_shhh"

ALGORITM = "HS256"

bcrypt_context = CryptContext(schemes=["bcrypt"],deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="usuarios/token")

class CreateUserRequest(BaseModel):
    username: str
    password: str
    imagen_perfil : str = Field(
        default="https://www.shutterstock.com/image-vector/default-avatar-profile-social-media-600nw-1920331226.jpg"
    )

class Token(BaseModel):
    access_token: str
    token_type: str

db_dependency = Annotated[Session, Depends(get_db)]

@router.get("/") #TODO: HACER LA LOGICA DE USUARIOS
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    users= db.query(User).offset(skip).limit(limit).all()
    return api_response(data=users, message="All customers users")

@router.post("/", status_code=status.HTTP_201_CREATED) #TODO Hacer la logica de iniciar sesion
def create_user(create_user_request: CreateUserRequest,db: Session = Depends(get_db)):
    create_user_model = User(
        nombre_usuario=create_user_request.username, 
        contrasenia=bcrypt_context.hash(create_user_request.password),
        imagen_perfil=create_user_request.imagen_perfil
    )
    db.add(create_user_model)
    db.commit()
    db.refresh(create_user_model)
    return create_user_model

@router.post("/token", response_model=Token)
async def login_for_access_token ( form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db:Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password,db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Could not validate user.")
    token = create_access_token(user.nombre_usuario, user.id, timedelta(minutes=30))

    return {"access_token":token, "token_type":"bearer"}

@router.get("/{id}/tareas", tags=["Usuarios y Tareas"])
def obtener_tareas_por_usuario(id: str, db: Session = Depends(get_db)):
    tareas = db.query(Tarea).filter(Tarea.id_usuario == id).all()
    if not tareas:
        raise HTTPException(status_code=404, detail="No se encontraron tareas para este usuario")
    return tareas

def authenticate_user(nombre_usuario:str, contrasenia:str,db:Session):
    user = db.query(User).filter(User.nombre_usuario==nombre_usuario).first()

    if not user or not bcrypt_context.verify(contrasenia,user.contrasenia):
        return False
    else:
        return user
    
def create_access_token(nombre_usuario: str, user_id:int,expires_delta:timedelta):
    encode = {"sub":nombre_usuario, "id":str(user_id)}
    expires= datetime.now(timezone.utc) + expires_delta
    encode.update({"exp":expires})
    return jwt.encode(encode,SECRET_KEY, algorithm=ALGORITM)



# @router.get("/{id}/tareas", tags=["Usuarios"])
# def obtener_tareas_por_usuario(id: int, db: Session = Depends(get_db)):
#     tareas = db.query(Tarea).filter(Tarea.usuario_id == id).all()
#     if not tareas:
#         raise HTTPException(status_code=404, detail="No se encontraron tareas para este usuario")
#     return tareas

#TODO /usuarios/refresh-token