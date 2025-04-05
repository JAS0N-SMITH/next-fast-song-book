from app import db
from datetime import datetime

class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    key = db.Column(db.String(10), nullable=False)
    tempo = db.Column(db.Integer, nullable=False)
    time_signature = db.Column(db.String(10), nullable=False)
    chords = db.Column(db.JSON, nullable=False)
    structure = db.Column(db.JSON, nullable=False)
    lyrics = db.Column(db.Text)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'key': self.key,
            'tempo': self.tempo,
            'timeSignature': self.time_signature,
            'chords': self.chords,
            'structure': self.structure,
            'lyrics': self.lyrics,
            'notes': self.notes,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }