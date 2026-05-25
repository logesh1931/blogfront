import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { login, register } = useAuth();
  const [form,  setForm]  = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy,  setBusy]  = useState(false);

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
        <p className="modal-sub">
          {mode === 'login' ? 'Welcome back to Inkwell' : 'Join the Inkwell community'}
        </p>

        {error && <div className="alert-err">{error}</div>}

        <form onSubmit={submit}>
          {mode === 'register' && (
            <div className="field">
              <label>Full name</label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="Your name" required />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={set('password')} placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'} required />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-accent" disabled={busy}>
              {busy ? '…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </form>

        <p className="switch-link">
          {mode === 'login'
            ? <>No account? <button onClick={() => onSwitch('register')}>Create one</button></>
            : <>Have an account? <button onClick={() => onSwitch('login')}>Sign in</button></>}
        </p>
      </div>
    </div>
  );
}
