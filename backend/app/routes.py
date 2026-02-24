from fastapi import APIRouter
from app.db import messages, users

router = APIRouter()

# Get all users
@router.get("/users")
async def get_users():
    user_list = []
    async for user in users.find({}, {"_id": 0, "password": 0}):
        user_list.append(user)
    return user_list


# Get chat history by room
@router.get("/messages/{room}")
async def get_messages(room: str):
    msgs = []
    async for msg in messages.find({"room": room}, {"_id": 0}):
        msgs.append(msg)
    return msgs
