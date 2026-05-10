from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base

from models.user_model import User
from models.service_model import Service
from models.booking_model import Booking

from routes import user_routes
from routes import service_routes
from routes import booking_routes

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes.router)
app.include_router(service_routes.router)
app.include_router(booking_routes.router)

@app.get("/")
def home():
    return {"message": "Smart Service Booking Backend Running"}