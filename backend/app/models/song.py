from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class Song(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    key = Column(String)
    tempo = Column(Integer)
    time_signature = Column(String)
    structure = Column(JSON)  # Store song structure (verses, choruses, etc.)
    chords = Column(JSON)     # Store chord progressions
    lyrics = Column(JSON)     # Store lyrics for different sections
    user_id = Column(String, ForeignKey("user.id"))
    
    # Relationships
    user = relationship("User", back_populates="songs") 