import React, { useState } from 'react';
import { worksAPI, WorkCreate } from '../api';
import { useAuth } from '../AuthContext';

const CreateWork: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<WorkCreate>({
    title: '',
    summary: '',
    content: '',
    tags: '',
    content_warnings: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setMessage({ type: 'error', text: 'You must be logged in to create works' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await worksAPI.create(formData);
      
      if (publish) {
        await worksAPI.update(response.data.id, { is_published: true });
      }
      
      setMessage({ 
        type: 'success', 
        text: publish ? 'Work published successfully!' : 'Work saved as draft!' 
      });
      
      // Reset form
      setFormData({
        title: '',
        summary: '',
        content: '',
        tags: '',
        content_warnings: '',
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save work' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Please log in to create works.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h2>Create New Work</h2>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          {message.text}
        </div>
      )}
      
      <form>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="summary" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={3}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              resize: 'vertical'
            }}
            placeholder="Brief description of your work..."
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="tags" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="fiction, romance, short story (comma-separated)"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="content_warnings" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Content Warnings
          </label>
          <input
            type="text"
            id="content_warnings"
            name="content_warnings"
            value={formData.content_warnings}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="violence, adult themes, etc. (comma-separated)"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={20}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              fontFamily: 'Georgia, serif',
              lineHeight: '1.6',
              resize: 'vertical'
            }}
            placeholder="Write your story, article, or other work here..."
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSubmitting || !formData.title || !formData.content}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting || !formData.title || !formData.content ? 0.6 : 1
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </button>
          
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting || !formData.title || !formData.content}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting || !formData.title || !formData.content ? 0.6 : 1
            }}
          >
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateWork;