// src/app/posts/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PostPage({ initialData }: { initialData: Post }) {
  const params = useParams();
  const { id } = params;

  const { data, error } = useSWR<Post>(id ? `/api/posts/${id}` : null, fetcher, { fallbackData: initialData });

  if (error) return <div>Failed to load post.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
      <p>
        <em>Submitted on: {new Date(data.createdAt).toLocaleString()}</em>
      </p>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/">
          <a style={{ color: 'blue', textDecoration: 'underline' }}>Submit Another Story</a>
        </Link>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // Optional: Pre-render some posts at build time
  return [];
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  // Optional: Set dynamic metadata based on the post
  return {
    title: `Story - ${params.id}`,
  };
}
