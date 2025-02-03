from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from model.models import Tarea
from db.database import SessionLocal
from db.database import get_db
from shemas.tareas_schema import Tarea_schema
from typing import List, Optional
from starlette import status 
router = APIRouter()

@router.post("/") #, response_model=Tarea_schema
def create_tarea(tarea: Tarea_schema, db: Session = Depends(get_db)):
    db_tarea = Tarea(**tarea.model_dump())
    db.add(db_tarea)
    db.commit()
    db.refresh(db_tarea)
    return db_tarea

@router.get("/") #, response_model=List[Tarea_schema]
def get_tareas(db: Session = Depends(get_db)):
    return db.query(Tarea).all()

@router.get("/{id}") #, response_model=Tarea_schema
def get_tarea(id: int, db: Session = Depends(get_db)):
    tarea = db.query(Tarea).filter(Tarea.id == id).first()
    if not tarea:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarea no encontrada")
    return tarea

@router.put("/{id}") #, response_model=Tarea_schema
def update_tarea(id: UUID, tarea: Tarea_schema, db: Session = Depends(get_db)):
    print(id)
    print(tarea)
    tarea.id=id
    print(tarea)
    db_tarea = db.query(Tarea).filter(Tarea.id == id).first()
    if not db_tarea:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarea no encontrada")
    for key, value in tarea.model_dump().items():
        setattr(db_tarea, key, value)
    db.commit()
    db.refresh(db_tarea)
    return db_tarea

@router.delete("/{id}") #, response_model=Tarea_schema
def delete_tarea(id: UUID, db: Session = Depends(get_db)):
    db_tarea = db.query(Tarea).filter(Tarea.id == id).first()
    if not db_tarea:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarea no encontrada")
    db.delete(db_tarea)
    db.commit()
    return {"detail": "Tarea eliminada"}
