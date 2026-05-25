import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const CATS = ['general','craft','design','technology','lifestyle','culture','personal','other'];

export default function PostForm() {
  const { id } = useParams();          // defined when editing
  const editing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form,   setForm]   = useState({ title: '', category: 'general', body: '' });
  const [error,  setError]  = useState('');
  const [busy,   setBusy]   = useState(false);
  const [loading,setLoading]= useState(editing);

  useEffect(() => {
    if (!user) navigate('/');
  }, [user]);

  useEffect(() => {
    if (!editing) return;
    postsAPI.get(id)
      .then(({ data }) => {
        setForm({ title: data.post.title, category: data.post.category, body: data.post.body });
      })
      .catch(() => { setError('Failed to load post'); })
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) { setError('Title and content are required'); return; }
    setBusy(true); setError('');
    try {
      if (editing) {
        await postsAPI.update(id, form);
        navigate(`/posts/${id}`);
      } else {
        const { data } = await postsAPI.create(form);
        navigate(`/posts/${data.post.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save post');
    } finally { setBusy(false); }
  }

  if (loading) return <div className="container"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      <button
        onClick={() => navigate(editing ? `/posts/${id}` : '/')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink3)', fontSize: '13.5px', cursor: 'pointer', background: 'none', border: 'none', marginBottom: '1.5rem', padding: 0 }}
      >
        ← {editing ? 'Back to post' : 'Back to feed'}
      </button>

      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--ff-head)', fontSize: '1.6rem', marginBottom: '1.5rem' }}>
          {editing ? 'Edit post' : 'Write a new post'}
        </h2>

        {error && <div className="alert-err">{error}</div>}

        <form onSubmit={submit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Title</label>
              <input
                type="text" value={form.title} onChange={set('title')}
                placeholder="Your post title" maxLength={200} required
              />
            </div>
            <div className="field">
              <label>Category</label>
              <select value={form.category} onChange={set('category')}>
                {CATS.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Content</label>
            <textarea
              value={form.body} onChange={set('body')}
              placeholder="Write your post here…"
              style={{ minHeight: 260 }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-ink" disabled={busy}>
              {busy ? 'Saving…' : editing ? 'Save changes' : 'Publish post'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate(editing ? `/posts/${id}` : '/')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
