from fastapi import FastAPI
from controllers.usuario_tarea_controller import router as usuario_tarea_controller
import model.models 
from db.database import engine, Base
from controllers.usuario_controller import router as usuario_router
from controllers.tareas_controller import router as tareas_router
from controllers.categorias_controller import router as categorias_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(debug=True)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)

app.include_router(usuario_router, prefix="/usuarios", tags=["Usuarios"])
app.include_router(tareas_router, prefix="/tareas", tags=["Tareas"])
app.include_router(categorias_router, prefix="/categorias", tags=["Categorias"])
Base.metadata.create_all(bind=engine)
@app.get("/")
async def root():
    return {"message": "Hello World"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permitir solo tu frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)