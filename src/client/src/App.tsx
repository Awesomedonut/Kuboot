import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import CreateWork from './components/CreateWork';
import WorksList from './components/WorksList';
import GoogleLogin from './components/GoogleLogin';
import './App.css';

const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav style={{
      padding: '10px 20px',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>
          Kuboot
        </Link>
        <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
          Browse Works
        </Link>
        {isAuthenticated && (
          <Link to="/create" style={{ textDecoration: 'none', color: '#007bff' }}>
            Create Work
          </Link>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {user?.picture && (
              <img 
                src={user.picture} 
                alt="Profile" 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%' 
                }} 
              />
            )}
            <span>Welcome, {user?.name || user?.username}!</span>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            style={{
              padding: '8px 16px',
              backgroundColor: '#4285f4',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Sign in with Google
          </Link>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<WorksList />} />
              <Route path="/create" element={<CreateWork />} />
              <Route path="/login" element={<GoogleLogin />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
