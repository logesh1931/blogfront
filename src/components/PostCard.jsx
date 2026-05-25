import { useNavigate } from 'react-router-dom';

function fmt(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const postId = post._id || post.id;
  const authorName = post.author?.name || post.author_name || '';
  const date = post.createdAt || post.created_at;
  const excerpt = post.body.replace(/\n+/g, ' ').slice(0, 180) + (post.body.length > 180 ? '…' : '');

  return (
    <div
      className="card"
      onClick={() => navigate(`/posts/${postId}`)}
      style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform .15s, box-shadow .15s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(26,20,16,.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div className="tag" style={{ marginBottom: '.75rem' }}>{post.category}</div>
      <h2 style={{ fontFamily: 'var(--ff-head)', fontSize: '1.3rem', marginBottom: '.45rem', lineHeight: 1.25 }}>
        {post.title}
      </h2>
      <p style={{ color: 'var(--ink3)', fontSize: '14px', lineHeight: 1.6, marginBottom: '1rem' }}>
        {excerpt}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flexWrap: 'wrap' }}>
        <div className="avatar">{initials(authorName)}</div>
        <span style={{ fontSize: '12.5px', color: 'var(--ink3)' }}>
          <strong style={{ color: 'var(--ink2)', fontWeight: 500 }}>{authorName}</strong>
          <span style={{ margin: '0 .4rem', color: 'var(--ink4)' }}>·</span>
          {fmt(date)}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '12.5px', color: 'var(--ink3)' }}>
          💬 {post.comment_count ?? 0}
        </span>
      </div>
    </div>
  );
}
