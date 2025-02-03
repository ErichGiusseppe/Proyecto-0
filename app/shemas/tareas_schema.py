from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime


class Tarea_schema(BaseModel):
    id : Optional[str] = None
    texto_tarea : Optional[str] = None
    estado : Optional[str] = None
        
    texto_tarea: Optional[str] = None
    fecha_creacion: Optional[datetime] = None
    fecha_tentativa_finalizacion: Optional[datetime] = None
    estado: Optional[str] = None

    id_usuario : Optional[str] = None
    id_categoria : Optional[str] = None
    class Config:
        orm_mode = True
