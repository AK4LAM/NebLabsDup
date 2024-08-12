// MISTAKE 
/*
// app/api/chat/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const res = await fetch('http://127.0.0.1:8000/chat/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Forward any other necessary headers
    },
    body: JSON.stringify(await request.json()),
  });

  const data = await res.json();

  return NextResponse.json(data);
}
*/