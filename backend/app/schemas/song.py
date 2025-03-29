from typing import Optional, Dict, Any
from pydantic import BaseModel

class SongBase(BaseModel):
    title: str
    key: str
    tempo: int
    time_signature: str
    structure: Dict[str, Any]
    chords: Dict[str, Any]
    lyrics: Dict[str, Any]

class SongCreate(SongBase):
    pass

class SongResponse(SongBase):
    id: int
    user_id: str

    class Config:
        from_attributes = True 