from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class User(BaseModel):
    username: str
    password: str

class Message(BaseModel):
    sender: str
    room: str
    text: str
    file: Optional[str] = None
    time: datetime = datetime.utcnow()
    seen: bool = False
