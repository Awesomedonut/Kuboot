// src/app/posts/page.tsx
'use client';

import Link from 'next/link';
import useSWR from 'swr';

interface Story {
  id: number;
  title: string;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PostsList({ initialData }: { initialData: Story[] }) {
  const { data, error } = useSWR<Story[]>('/api/posts', fetcher, { fallbackData: initialData });

  if (error) return <div>Failed to load posts.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>All Stories</h1>
      {data.length === 0 ? (
        <p>No stories have been submitted yet.</p>
      ) : (
        <ul>
          {data.map((post) => (
            <li key={post.id} style={{ marginBottom: '1rem' }}>
              <Link href={`/posts/${post.id}`}>
                {/* <a style={{ fontSize: '1.2rem', color: 'blue', textDecoration: 'underline' }}>
                  {post.title}
                </a> */}
              </Link>
              <p style={{ fontSize: '0.9rem', color: 'gray' }}>
                Submitted on: {new Date(post.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: '2rem' }}>
        <Link href="/">
          <a style={{ color: 'blue', textDecoration: 'underline' }}>Submit a New Story</a>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  // Since we're using the App Directory, this function isn't directly applicable.
  // Instead, use server components or fetch data within the component.
  return { props: { initialData: [] } };
}
