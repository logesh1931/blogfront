import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';

const CATS = ['all','craft','design','technology','lifestyle','culture','personal','other'];

export default function Home({ onAuthClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cat, setCat] = useState('all');
  const { posts, loading, error } = usePosts(cat !== 'all' ? { category: cat } : {});

  return (
    <div className="container">
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '3rem 0 2rem' }}>
        <h1 style={{ fontFamily: 'var(--ff-head)', fontSize: 'clamp(2rem,5vw,2.8rem)', lineHeight: 1.2, marginBottom: '.7rem' }}>
          Words worth <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>reading</em>
        </h1>
        <p style={{ color: 'var(--ink3)', fontSize: '1.05rem', maxWidth: 460, margin: '0 auto .25rem' }}>
          A thoughtful space for writers and readers. Share ideas, tell stories, spark conversations.
        </p>
      </div>

      <div className="divider" />

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: 'var(--ink3)', marginRight: 4 }}>Filter:</span>
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              padding: '4px 12px', borderRadius: 20, fontSize: '12.5px', fontWeight: 500,
              border: '1.5px solid',
              borderColor: cat === c ? 'var(--accent)' : 'var(--cream3)',
              background: cat === c ? 'var(--accent3)' : 'transparent',
              color: cat === c ? 'var(--accent)' : 'var(--ink3)',
              cursor: 'pointer', textTransform: 'capitalize',
            }}
          >
            {c}
          </button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          {user
            ? <button className="btn btn-ink btn-sm" onClick={() => navigate('/new-post')}>+ Write post</button>
            : <button className="btn btn-accent btn-sm" onClick={onAuthClick}>Sign in to write</button>}
        </div>
      </div>

      {/* Content */}
      {loading && <div className="spinner" />}
      {error   && <div className="alert-err">{error}</div>}
      {!loading && !error && posts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--ink3)' }}>
          <h3 style={{ fontFamily: 'var(--ff-head)', fontSize: '1.4rem', marginBottom: '.5rem', color: 'var(--ink2)' }}>
            No posts yet
          </h3>
          <p>Be the first to publish something.</p>
        </div>
      )}
      <div style={{ display: 'grid', gap: '1.2rem' }}>
        {posts.map(p => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}
