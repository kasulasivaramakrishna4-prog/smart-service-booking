from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.user_routes import router as user_router
from routes.service_routes import router as service_router
from routes.booking_routes import router as booking_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://smart-service-booking-one.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(service_router)
app.include_router(booking_router)

@app.get("/")
def home():
    return {"message": "Smart Service Booking Backend Running"}