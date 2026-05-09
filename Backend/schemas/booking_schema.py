from pydantic import BaseModel

class BookingCreate(BaseModel):
    user_id: int
    service_id: int
    phone: str
    booking_date: str
    booking_time: str

class BookingStatusUpdate(BaseModel):
    status: str
