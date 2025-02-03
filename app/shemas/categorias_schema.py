from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime

class Categoria_schema(BaseModel):
    id : Optional[UUID] = None
    nombre : Optional[str] = None
    descripcion : Optional[str] = None
    class Config:
        orm_mode = True