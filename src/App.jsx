import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar    from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home       from './pages/Home';
import PostDetail from './pages/PostDetail';
import PostForm   from './pages/PostForm';
import './index.css';

function AppShell() {
  const [authMode, setAuthMode] = useState(null); // null | 'login' | 'register'

  return (
    <>
      <Navbar
        onLoginClick={() => setAuthMode('login')}
        onRegisterClick={() => setAuthMode('register')}
      />

      <Routes>
        <Route path="/"               element={<Home       onAuthClick={() => setAuthMode('login')} />} />
        <Route path="/posts/:id"      element={<PostDetail onAuthClick={() => setAuthMode('login')} />} />
        <Route path="/new-post"       element={<PostForm />} />
        <Route path="/posts/:id/edit" element={<PostForm />} />
        <Route path="*" element={
          <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
            <h2 style={{ fontFamily: 'var(--ff-head)', fontSize: '2rem', marginBottom: '.5rem' }}>404</h2>
            <p style={{ color: 'var(--ink3)' }}>Page not found.</p>
          </div>
        } />
      </Routes>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitch={setAuthMode}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
