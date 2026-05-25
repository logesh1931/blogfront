import api from './client';

// ─── Auth ─────────────────────────────────────────────────────────
export const authAPI = {
  register: (data)        => api.post('/auth/register', data),
  login:    (data)        => api.post('/auth/login', data),
  me:       ()            => api.get('/auth/me'),
  updateProfile: (data)   => api.patch('/auth/profile', data),
};

// ─── Posts ────────────────────────────────────────────────────────
export const postsAPI = {
  list:   (params)        => api.get('/posts', { params }),
  get:    (id)            => api.get(`/posts/${id}`),
  create: (data)          => api.post('/posts', data),
  update: (id, data)      => api.patch(`/posts/${id}`, data),
  delete: (id)            => api.delete(`/posts/${id}`),
};

// ─── Comments ─────────────────────────────────────────────────────
export const commentsAPI = {
  list:   (postId)             => api.get(`/posts/${postId}/comments`),
  create: (postId, data)       => api.post(`/posts/${postId}/comments`, data),
  update: (postId, id, data)   => api.patch(`/posts/${postId}/comments/${id}`, data),
  delete: (postId, id)         => api.delete(`/posts/${postId}/comments/${id}`),
};
