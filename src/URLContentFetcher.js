import React, { useState } from 'react';

const URLContentFetcher = () => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [cssStyles, setCssStyles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const RAILS_PROXY_URL = 'http://localhost:3000/proxy';

  const fetchContent = async () => {
    if (!url) return;

    setIsLoading(true);
    setError('');
    setCssStyles([]);

    try {
      const response = await fetch(`${RAILS_PROXY_URL}?url=${encodeURIComponent(url)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setContent(data.html);
      
      // Create style elements for each CSS file
      const styles = data.css.map(css => css.content).join('\n');
      setCssStyles(styles);

    } catch (err) {
      setError(`Failed to fetch content: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="url"
          placeholder="Enter URL to fetch"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
        <button
          onClick={fetchContent}
          disabled={isLoading || !url}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Loading...' : 'Fetch Content'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          color: '#dc2626'
        }}>
          {error}
        </div>
      )}

      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#fff',
        minHeight: '200px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        {/* Inject CSS styles */}
        {cssStyles && <style>{cssStyles}</style>}
        
        {isLoading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
            Loading...
          </div>
        ) : content ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            Enter a URL and click "Fetch Content" to view the content here
          </p>
        )}
      </div>
    </div>
  );
};

export default URLContentFetcher;