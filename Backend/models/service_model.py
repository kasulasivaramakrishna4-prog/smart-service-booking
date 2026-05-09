from sqlalchemy import Column, Integer, String
from database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String(100))
    description = Column(String(255))
    price = Column(Integer)