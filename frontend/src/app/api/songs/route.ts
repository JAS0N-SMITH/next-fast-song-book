import { NextResponse } from 'next/server';

const songs = [
  {
    id: '1',
    title: 'Example Song',
    key: 'C',
    tempo: 120,
    timeSignature: '4/4',
    chords: ['C', 'Am', 'F', 'G'],
    structure: ['Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus'],
    lyrics: 'Example lyrics...',
    notes: 'Some notes about the song...',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  // Sort songs by creation date, newest first
  const sortedSongs = [...songs].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(sortedSongs);
}

export async function POST(request: Request) {
  const song = await request.json();
  const newSong = {
    ...song,
    id: Math.random().toString(36).substring(7),
    createdAt: new Date().toISOString(),
  };
  songs.push(newSong);
  return NextResponse.json(newSong);
}

export async function PATCH(request: Request) {
  const song = await request.json();
  const index = songs.findIndex(s => s.id === song.id);
  if (index === -1) {
    return new NextResponse('Song not found', { status: 404 });
  }
  songs[index] = { ...songs[index], ...song };
  return NextResponse.json(songs[index]);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const index = songs.findIndex(s => s.id === id);
  if (index === -1) {
    return new NextResponse('Song not found', { status: 404 });
  }
  songs.splice(index, 1);
  return new NextResponse(null, { status: 204 });
} 