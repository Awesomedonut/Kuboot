import React, { useState, useEffect } from 'react';
import { worksAPI, Work } from '../api';

const WorksList: React.FC = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await worksAPI.getAll();
        setWorks(response.data);
      } catch (error) {
        setError('Failed to load works');
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading works...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <p>{error}</p>
      </div>
    );
  }

  if (works.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No published works found. Be the first to share your writing!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Published Works</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {works.map((work) => (
          <div
            key={work.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
              {work.title}
            </h3>
            
            <div style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '10px',
              display: 'flex',
              gap: '20px'
            }}>
              <span>By: {work.author.username}</span>
              <span>{work.word_count} words</span>
              <span>
                {new Date(work.published_at || work.created_at).toLocaleDateString()}
              </span>
            </div>

            {work.summary && (
              <p style={{ 
                margin: '10px 0', 
                color: '#555',
                fontStyle: 'italic'
              }}>
                {work.summary}
              </p>
            )}

            {work.tags && (
              <div style={{ marginBottom: '10px' }}>
                {work.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#e9ecef',
                      color: '#495057',
                      padding: '2px 8px',
                      marginRight: '5px',
                      marginBottom: '5px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {work.content_warnings && (
              <div style={{ 
                marginBottom: '10px',
                padding: '8px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <strong>Content Warnings:</strong> {work.content_warnings}
              </div>
            )}

            <div style={{
              maxHeight: '200px',
              overflow: 'hidden',
              position: 'relative',
              marginTop: '15px'
            }}>
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  color: '#333'
                }}
              >
                {work.content.length > 500 
                  ? work.content.substring(0, 500) + '...'
                  : work.content
                }
              </div>
              {work.content.length > 500 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    background: 'linear-gradient(to right, transparent, white)',
                    padding: '0 20px',
                    fontSize: '14px',
                    color: '#007bff',
                    cursor: 'pointer'
                  }}
                >
                  Read more...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorksList;