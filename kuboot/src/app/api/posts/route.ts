import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    const post = await prisma.story.create({
      data: { title, content },
    });

    return NextResponse.json({ id: post.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post.'+ error }, { status: 500 });
  }
}
