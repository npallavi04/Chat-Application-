import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
app = FastAPI()

socket_app = socketio.ASGIApp(sio, other_asgi_app=app, socketio_path="ws/socket.io")

# ---------------- DATABASE ----------------
DATABASE_URL = "sqlite:///./users.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    username = Column(String, primary_key=True, index=True)
    password = Column(String)

Base.metadata.create_all(bind=engine)

# ---------------- MODELS ----------------
class LoginData(BaseModel):
    username: str
    password: str

class RegisterData(BaseModel):
    username: str
    password: str

# ---------------- SOCKET USERS ----------------
online_users = {}

@sio.event
async def connect(sid, environ):
    print("Client connected:", sid)

@sio.event
async def join(sid, data):
    username = data["user"]
    online_users[username] = sid
    await sio.emit("online_users", list(online_users.keys()))

@sio.event
async def disconnect(sid):
    for user, user_sid in list(online_users.items()):
        if user_sid == sid:
            del online_users[user]
            break
    await sio.emit("online_users", list(online_users.keys()))

@sio.event
async def private_message(sid, data):
    recipient = data["recipient"]
    if recipient in online_users:
        await sio.emit("receive_private", data, to=online_users[recipient])
        await sio.emit("receive_private", data, to=sid)

# ---------------- API ----------------
@app.post("/register")
async def register(data: RegisterData):
    db = SessionLocal()
    user = db.query(User).filter(User.username == data.username).first()

    if user:
        return {"success": False, "message": "User already exists"}

    new_user = User(username=data.username, password=data.password)
    db.add(new_user)
    db.commit()
    db.close()

    return {"success": True}

@app.post("/login")
async def login(data: LoginData):
    db = SessionLocal()
    user = db.query(User).filter(User.username == data.username).first()
    db.close()

    if user and user.password == data.password:
        return {"success": True, "user": user.username}

    return {"success": False, "message": "Invalid credentials"}

# ---------------- MIDDLEWARE ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"msg": "FastAPI running"}