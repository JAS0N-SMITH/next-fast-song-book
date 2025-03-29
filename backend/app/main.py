from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# In-memory storage for songs
songs = []

@app.route('/')
def root():
    return jsonify({"message": "Welcome to the Song Management API"})

@app.route('/api/songs', methods=['GET'])
def get_songs():
    return jsonify(songs)

@app.route('/api/songs', methods=['POST'])
def create_song():
    song = request.json
    song['id'] = str(len(songs) + 1)
    songs.append(song)
    return jsonify(song)

@app.route('/api/songs/<song_id>', methods=['GET'])
def get_song(song_id):
    song = next((s for s in songs if s['id'] == song_id), None)
    if not song:
        return jsonify({"detail": "Song not found"}), 404
    return jsonify(song)

@app.route('/api/songs/<song_id>', methods=['PATCH'])
def update_song(song_id):
    song_index = next((i for i, s in enumerate(songs) if s['id'] == song_id), None)
    if song_index is None:
        return jsonify({"detail": "Song not found"}), 404
    
    updated_song = request.json
    updated_song['id'] = song_id
    songs[song_index] = updated_song
    return jsonify(updated_song)

@app.route('/api/songs/<song_id>', methods=['DELETE'])
def delete_song(song_id):
    song_index = next((i for i, s in enumerate(songs) if s['id'] == song_id), None)
    if song_index is None:
        return jsonify({"detail": "Song not found"}), 404
    
    songs.pop(song_index)
    return jsonify({"message": "Song deleted successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True) 