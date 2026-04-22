import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItem';
import ViewItems from './pages/ViewItems';
import Profile from './pages/Profile';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const location = useLocation();

  // Listen for storage changes (this fixes navigation after login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const newStatus = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(newStatus);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check on every location change (important for same-tab navigation)
    handleStorageChange();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location]);

  return (
    <>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/add-item" element={isLoggedIn ? <AddItem /> : <Navigate to="/login" replace />} />
        <Route path="/view-items" element={isLoggedIn ? <ViewItems /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;