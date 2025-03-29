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
  },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const song = songs.find(s => s.id === params.id);
  if (!song) {
    return new NextResponse('Song not found', { status: 404 });
  }
  return NextResponse.json(song);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const updates = await request.json();
  const index = songs.findIndex(s => s.id === params.id);
  if (index === -1) {
    return new NextResponse('Song not found', { status: 404 });
  }
  songs[index] = { ...songs[index], ...updates };
  return NextResponse.json(songs[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = songs.findIndex(s => s.id === params.id);
  if (index === -1) {
    return new NextResponse('Song not found', { status: 404 });
  }
  songs.splice(index, 1);
  return new NextResponse(null, { status: 204 });
} 