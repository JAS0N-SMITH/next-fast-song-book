from sqlalchemy import Column, String
from app.models.base import Base

class User(Base):
    id = Column(String, primary_key=True, index=True)  # Auth0 user ID
    email = Column(String, unique=True, index=True)
    name = Column(String)
    picture = Column(String)  # URL to user's profile picture 