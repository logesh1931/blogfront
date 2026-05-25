import { useState, useEffect, useCallback } from 'react';
import { postsAPI, commentsAPI } from '../api';

// ─── usePosts ─────────────────────────────────────────────────────
export function usePosts(filters = {}) {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data } = await postsAPI.list(filters);
      setPosts(data.posts);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { posts, loading, error, refetch: fetch, setPosts };
}

// ─── usePost ──────────────────────────────────────────────────────
export function usePost(id) {
  const [post,     setPost]     = useState(null);
  const [comments, setComments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true); setError('');
    try {
      const { data } = await postsAPI.get(id);
      setPost(data.post);
      setComments(data.comments);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { post, comments, loading, error, refetch: fetch, setComments };
}
