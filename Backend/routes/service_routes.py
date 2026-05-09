from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal
from models.service_model import Service
from schemas.service_schema import ServiceCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/services")
def add_service(service: ServiceCreate, db: Session = Depends(get_db)):
    existing_service = db.query(Service).filter(
        Service.service_name == service.service_name
    ).first()

    if existing_service:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Service already exists"
        )

    new_service = Service(
        service_name=service.service_name,
        description=service.description,
        price=service.price
    )

    db.add(new_service)
    db.commit()
    db.refresh(new_service)

    return {
        "message": "Service added successfully",
        "service": {
            "id": new_service.id,
            "service_name": new_service.service_name,
            "description": new_service.description,
            "price": new_service.price
        }
    }

@router.get("/services")
def get_services(db: Session = Depends(get_db)):
    services = db.query(Service).all()

    return services

@router.delete("/services/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )

    db.delete(service)
    db.commit()

    return {
        "message": "Service deleted successfully"
    }
