from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from model.models import User
from db.database import get_db
from utils.response_wrapper import api_response
from uuid import UUID
from shemas.categorias_schema import Categoria_schema

from model.models import Categoria

router = APIRouter()

@router.post("/")
def create_categoria(categoria: Categoria_schema, db: Session = Depends(get_db)):
    db_categoria = Categoria(**categoria.model_dump())
    print(db_categoria.nombre)
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

@router.get("/")
def get_categorias(db: Session = Depends(get_db)):
    return db.query(Categoria).all()

@router.get("/{id}")
def get_categoria(id: int, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria

@router.put("/{id}")
def update_categoria(id: int, categoria: Categoria_schema, db: Session = Depends(get_db)):
    db_categoria = db.query(Categoria).filter(Categoria.id == id).first()
    if not db_categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    for key, value in categoria.model_dump().items():
        setattr(db_categoria, key, value)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

@router.delete("/{id}")
def delete_categoria(id: str, db: Session = Depends(get_db)):
    db_categoria = db.query(Categoria).filter(Categoria.id == id).first()
    if not db_categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    db.delete(db_categoria)
    db.commit()
    return {"detail": "Categoría eliminada"}