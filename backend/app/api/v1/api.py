from fastapi import APIRouter
from app.api.v1.endpoints import songs

api_router = APIRouter()

api_router.include_router(songs.router, prefix="/songs", tags=["songs"]) 