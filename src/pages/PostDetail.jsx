import { useParams, useNavigate } from 'react-router-dom';
import { usePost } from '../hooks/usePosts';
import { postsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';

function fmt(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function PostDetail({ onAuthClick }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { post, comments, loading, error, setComments } = usePost(id);

  async function handleDelete() {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    try {
      await postsAPI.delete(id);
      navigate('/');
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to delete post');
    }
  }

  if (loading) return <div className="container"><div className="spinner" /></div>;
  if (error)   return <div className="container"><div className="alert-err">{error}</div></div>;
  if (!post)   return null;

  const isOwner = user?.id === post.author_id;

  return (
    <div className="container">
      <button
        onClick={() => navigate('/')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink3)', fontSize: '13.5px', cursor: 'pointer', background: 'none', border: 'none', marginBottom: '1.5rem', padding: 0 }}
      >
        ← Back to feed
      </button>

      <div className="card" style={{ padding: '2rem', marginBottom: 0 }}>
        <div className="tag" style={{ marginBottom: '.75rem' }}>{post.category}</div>
        <h1 style={{ fontFamily: 'var(--ff-head)', fontSize: 'clamp(1.5rem,4vw,2rem)', marginBottom: '1rem', lineHeight: 1.25 }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.5rem' }}>
          <div className="avatar avatar-lg">{initials(post.author_name)}</div>
          <div>
            <div style={{ fontWeight: 500, fontSize: '14px' }}>{post.author_name}</div>
            <div style={{ fontSize: '12px', color: 'var(--ink3)' }}>{fmt(post.created_at)}</div>
          </div>
        </div>

        <div style={{ fontSize: '15.5px', lineHeight: 1.8, color: 'var(--ink2)', whiteSpace: 'pre-line' }}>
          {post.body}
        </div>

        {isOwner && (
          <div style={{ display: 'flex', gap: 8, marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--cream3)' }}>
            <button className="btn btn-outline btn-sm" onClick={() => navigate(`/posts/${id}/edit`)}>
              Edit post
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              Delete post
            </button>
          </div>
        )}
      </div>

      <CommentSection
        postId={Number(id)}
        comments={comments}
        setComments={setComments}
        onAuthNeeded={onAuthClick}
      />
    </div>
  );
}
