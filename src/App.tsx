import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import FloorPlanGenerator from './pages/FloorPlanGenerator';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import SavedPlansPage from './pages/SavedPlansPage';

function App() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Protected routes logic
    const protectedRoutes = [
      '/dashboard', 
      '/floor-plan-generator', 
      '/profile',
      '/saved-plans'
    ];
    
    const isProtectedRoute = protectedRoutes.some(route => 
      location.pathname.startsWith(route)
    );

    if (isProtectedRoute && !session) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [session, navigate, location]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/floor-plan-generator" element={<FloorPlanGenerator />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/saved-plans" element={<SavedPlansPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;