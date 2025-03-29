from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///songs.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Song model
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

# Create tables
with app.app_context():
    db.create_all()

@app.route('/api/songs', methods=['GET'])
def get_songs():
    songs = Song.query.all()
    return jsonify([song.to_dict() for song in songs])

@app.route('/api/songs', methods=['POST'])
def create_song():
    data = request.json
    new_song = Song(
        title=data['title'],
        key=data['key'],
        tempo=data['tempo'],
        time_signature=data['timeSignature'],
        chords=data['chords'],
        structure=data['structure'],
        lyrics=data.get('lyrics', ''),
        notes=data.get('notes', '')
    )
    db.session.add(new_song)
    db.session.commit()
    return jsonify(new_song.to_dict()), 201

@app.route('/api/songs/<int:song_id>', methods=['GET'])
def get_song(song_id):
    song = Song.query.get_or_404(song_id)
    return jsonify(song.to_dict())

@app.route('/api/songs/<int:song_id>', methods=['PATCH'])
def update_song(song_id):
    song = Song.query.get_or_404(song_id)
    data = request.json
    
    song.title = data.get('title', song.title)
    song.key = data.get('key', song.key)
    song.tempo = data.get('tempo', song.tempo)
    song.time_signature = data.get('timeSignature', song.time_signature)
    song.chords = data.get('chords', song.chords)
    song.structure = data.get('structure', song.structure)
    song.lyrics = data.get('lyrics', song.lyrics)
    song.notes = data.get('notes', song.notes)
    
    db.session.commit()
    return jsonify(song.to_dict())

@app.route('/api/songs/<int:song_id>', methods=['DELETE'])
def delete_song(song_id):
    song = Song.query.get_or_404(song_id)
    db.session.delete(song)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    app.run(debug=True, port=3001) 