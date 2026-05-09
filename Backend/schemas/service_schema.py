from pydantic import BaseModel

class ServiceCreate(BaseModel):
    service_name: str
    description: str
    price: int