from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from uuid import UUID

class User(BaseModel):
    id : Optional[UUID] = None
    nombre_usuario : Optional[str] = None
    contrasenia : Optional[str] = None
    imagen_perfil : Optional[str] = None
    class Config:
        orm_mode = True