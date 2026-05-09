from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    service_id = Column(Integer, ForeignKey("services.id"))

    booking_date = Column(String(50))
    booking_time = Column(String(50))
    phone = Column(String(20))

    status = Column(String(50), default="Pending")
