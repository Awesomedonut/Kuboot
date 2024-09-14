// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import prisma from '../../lib/prisma';

interface FormValues {
  title: string;
  content: string;
}

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const initialValues: FormValues = { title: '', content: '' };
  const validationSchema = Yup.object({
    title: Yup.string().required('Required'),
    content: Yup.string().required('Required'),
  });

  const onSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setError(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong.');

      router.push(`/posts/${data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Submit a Story</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="title">Title</label>
              <Field
                type="text"
                id="title"
                name="title"
                placeholder="Story Title"
                style={{ width: '100%', padding: '0.5rem' }}
              />
              <ErrorMessage name="title" component="div"/>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="content">Content</label>
              <Field
                as="textarea"
                id="content"
                name="content"
                placeholder="Story Content"
                rows="10"
                style={{ width: '100%', padding: '0.5rem' }}
              />
              <ErrorMessage name="content" component="div"/>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ padding: '0.5rem 1rem' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Story'}
            </button>
          </Form>
        )}
      </Formik>

      <div style={{ marginTop: '2rem' }}>
        <Link href="/posts">
          {/* <a style={{ color: 'blue', textDecoration: 'underline' }}>View All Stories</a> */}
        </Link>
      </div>
    </div>
  );
}
