import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { commentsAPI } from '../api';

function fmt(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function CommentSection({ postId, comments, setComments, onAuthNeeded }) {
  const { user } = useAuth();
  const [draft,   setDraft]   = useState('');
  const [busy,    setBusy]    = useState(false);
  const [editId,  setEditId]  = useState(null);
  const [editVal, setEditVal] = useState('');
  const [error,   setError]   = useState('');

  async function addComment() {
    if (!draft.trim()) return;
    setBusy(true); setError('');
    try {
      const { data } = await commentsAPI.create(postId, { body: draft.trim() });
      setComments(prev => [...prev, data.comment]);
      setDraft('');
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to add comment');
    } finally { setBusy(false); }
  }

  async function saveEdit(id) {
    if (!editVal.trim()) return;
    try {
      const { data } = await commentsAPI.update(postId, id, { body: editVal.trim() });
      setComments(prev => prev.map(c => c.id === id ? data.comment : c));
      setEditId(null);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to update');
    }
  }

  async function deleteComment(id) {
    if (!confirm('Delete this comment?')) return;
    try {
      await commentsAPI.delete(postId, id);
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to delete');
    }
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ fontFamily: 'var(--ff-head)', fontSize: '1.25rem', marginBottom: '1rem' }}>
        Discussion ({comments.length})
      </h3>

      {error && <div className="alert-err">{error}</div>}

      {comments.length === 0 && (
        <p style={{ color: 'var(--ink3)', fontSize: '14px', marginBottom: '1rem' }}>
          No comments yet — start the conversation!
        </p>
      )}

      {comments.map(c => (
        <div key={c.id} style={{
          background: 'var(--cream)', borderRadius: 'var(--r)', padding: '1rem',
          marginBottom: '.75rem', border: '1px solid var(--cream3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.5rem' }}>
            <div className="avatar" style={{ width: 26, height: 26, fontSize: 10 }}>
              {initials(c.author_name)}
            </div>
            <span style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--ink2)' }}>
              {c.author_name}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--ink4)', marginLeft: 'auto' }}>
              {fmt(c.created_at)}
            </span>
          </div>

          {editId === c.id ? (
            <>
              <textarea
                value={editVal}
                onChange={e => setEditVal(e.target.value)}
                style={{
                  width: '100%', padding: '8px', border: '1.5px solid var(--cream3)',
                  borderRadius: 'var(--r)', fontSize: '14px', resize: 'vertical', minHeight: 70,
                  background: '#fff', color: 'var(--ink)'
                }}
              />
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <button className="btn btn-ink btn-sm" onClick={() => saveEdit(c.id)}>Save</button>
                <button className="btn btn-outline btn-sm" onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: '14px', color: 'var(--ink2)', lineHeight: 1.6 }}>{c.body}</p>
              {user?.id === c.author_id && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => { setEditId(c.id); setEditVal(c.body); }}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteComment(c.id)}>
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {user ? (
        <div style={{ marginTop: '1rem' }}>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Share your thoughts…"
            style={{
              width: '100%', padding: '10px 12px', border: '1.5px solid var(--cream3)',
              borderRadius: 'var(--r)', fontSize: '14px', resize: 'vertical', minHeight: 80,
              background: '#fff', color: 'var(--ink)'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '.5rem' }}>
            <button className="btn btn-ink btn-sm" onClick={addComment} disabled={busy || !draft.trim()}>
              {busy ? 'Posting…' : 'Post comment'}
            </button>
          </div>
        </div>
      ) : (
        <p style={{ marginTop: '1rem', fontSize: '14px', color: 'var(--ink3)' }}>
          <button onClick={onAuthNeeded} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit' }}>
            Sign in
          </button>{' '}
          to join the conversation.
        </p>
      )}
    </div>
  );
}
