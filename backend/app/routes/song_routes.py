from flask import Blueprint, request, jsonify
from app.models.song import Song
from app import db

song_bp = Blueprint('songs', __name__, url_prefix='/api/songs')

@song_bp.route('/', methods=['GET'])
def get_songs():
    songs = Song.query.all()
    return jsonify([song.to_dict() for song in songs])

@song_bp.route('/', methods=['POST'])
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

@song_bp.route('/<int:song_id>', methods=['GET'])
def get_song(song_id):
    song = Song.query.get_or_404(song_id)
    return jsonify(song.to_dict())

@song_bp.route('/<int:song_id>', methods=['PATCH'])
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

@song_bp.route('/<int:song_id>', methods=['DELETE'])
def delete_song(song_id):
    song = Song.query.get_or_404(song_id)
    db.session.delete(song)
    db.session.commit()
    return '', 204