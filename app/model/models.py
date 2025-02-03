from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from db.database import Base
import uuid

class User(Base):
    __tablename__ = 'users'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, index=True)
    nombre_usuario = Column(String(50), unique=True)
    contrasenia = Column(String(50), unique=False)
    imagen_perfil = Column(String(50), unique=False)

    tareas = relationship("Tarea", back_populates="usuario")


class Categoria(Base):
    __tablename__ = 'categoria'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, index=True)
    nombre = Column(String(50), unique=True)
    descripcion = Column(String(100), unique=False)

    tareas = relationship("Tarea", back_populates="categoria")


class Tarea(Base):
    __tablename__ = 'tareas'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, index=True)
    texto_tarea = Column(String(50), unique=False)
    fecha_creacion = Column(DateTime, unique=False)
    fecha_tentativa_finalizacion = Column(DateTime, unique=False)
    estado = Column(String(50), unique=False)

    id_usuario = Column(Integer, ForeignKey('users.id'))
    id_categoria = Column(Integer, ForeignKey('categoria.id'))

    usuario = relationship("User", back_populates="tareas")
    categoria = relationship("Categoria", back_populates="tareas")
