import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="topbar">
      <div className="topbar-brand" onClick={() => navigate('/')}>
        Ink<span>well</span>
      </div>
      <div className="topbar-nav">
        {user ? (
          <>
            <div className="user-badge">
              <div className="avatar" style={{ background: '#e8c5a0', color: '#1a1410' }}>
                {initials(user.name)}
              </div>
              <span className="hide-mobile">{user.name.split(' ')[0]}</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/new-post')}>
              + Write
            </button>
            <button className="btn btn-ghost btn-sm" onClick={logout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost btn-sm" onClick={onLoginClick}>Sign in</button>
            <button className="btn btn-accent btn-sm" onClick={onRegisterClick}>Join</button>
          </>
        )}
      </div>
    </nav>
  );
}
