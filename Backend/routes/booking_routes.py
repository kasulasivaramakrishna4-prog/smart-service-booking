from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal
from models.booking_model import Booking
from models.service_model import Service
from models.user_model import User
from schemas.booking_schema import BookingCreate, BookingStatusUpdate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CREATE BOOKING API
@router.post("/bookings")
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == booking.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    service = db.query(Service).filter(Service.id == booking.service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )

    new_booking = Booking(
        user_id=booking.user_id,
        service_id=booking.service_id,
        phone=booking.phone,
        booking_date=booking.booking_date,
        booking_time=booking.booking_time,
        status="Pending"
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return {
        "message": "Booking created successfully",
        "booking": {
            "id": new_booking.id,
            "user_id": new_booking.user_id,
            "service_id": new_booking.service_id,
            "phone": new_booking.phone,
            "booking_date": new_booking.booking_date,
            "booking_time": new_booking.booking_time,
            "status": new_booking.status
        }
    }


# GET BOOKINGS API
@router.get("/bookings")
def get_bookings(db: Session = Depends(get_db)):

    bookings = db.query(Booking).all()

    booking_list = []

    for booking in bookings:
        user = db.query(User).filter(User.id == booking.user_id).first()
        service = db.query(Service).filter(Service.id == booking.service_id).first()

        booking_list.append({
            "id": booking.id,
            "user_name": user.name if user else "Unknown user",
            "service_name": service.service_name if service else "Unknown service",
            "phone": booking.phone,
            "booking_date": booking.booking_date,
            "booking_time": booking.booking_time,
            "status": booking.status
        })

    return booking_list


@router.get("/bookings/user/{user_id}")
def get_user_bookings(user_id: int, db: Session = Depends(get_db)):
    bookings = db.query(Booking).filter(Booking.user_id == user_id).all()

    booking_list = []

    for booking in bookings:
        service = db.query(Service).filter(Service.id == booking.service_id).first()

        booking_list.append({
            "id": booking.id,
            "service_name": service.service_name if service else "Service not found",
            "phone": booking.phone,
            "booking_date": booking.booking_date,
            "booking_time": booking.booking_time,
            "status": booking.status
        })

    return booking_list


# UPDATE STATUS API
@router.put("/bookings/{booking_id}/status")
def update_booking_status(
    booking_id: int,
    status_data: BookingStatusUpdate,
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        return {"message": "Booking not found"}

    booking.status = status_data.status

    db.commit()
    db.refresh(booking)

    return {
        "message": "Booking status updated successfully"
    }

@router.delete("/bookings/{booking_id}")
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):

    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if not booking:
        return {"message": "Booking not found"}

    db.delete(booking)

    db.commit()

    return {
        "message": "Booking deleted successfully"
    }
