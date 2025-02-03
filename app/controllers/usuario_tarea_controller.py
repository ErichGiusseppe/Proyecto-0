from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from model.models import Tarea

router = APIRouter()

@router.get("/{id}/tareas", tags=["Usuarios y Tareas"])
def obtener_tareas_por_usuario(id: UUID, db: Session = Depends(get_db)):
    tareas = db.query(Tarea).filter(Tarea.usuario_id == id).all()
    if not tareas:
        raise HTTPException(status_code=404, detail="No se encontraron tareas para este usuario")
    return tareas