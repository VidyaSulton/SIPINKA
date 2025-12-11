import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

// User pages
import UserDashboard from './pages/user/UserDashboard';
import BookingPage from './pages/user/BookingPage';
import MyBookingPage from './pages/user/MyBookingPage';

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Public Route (redirect jika sudah login)
function PublicRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>;
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  }

  return children;
}


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
          />
          <Route path='/register' element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
          />

          {/* User Routes */}
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
          />
          <Route path='/dashboard/bookings' element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
          />
          <Route path='/dashboard/my-bookings' element={
            <ProtectedRoute>
              <MyBookingPage />
            </ProtectedRoute>
          }
          />

          {/* Admin Routes */}
          <Route path='/admin' element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
          />

          {/* Default Redirect */}
          <Route path='/' element={<Navigate to="/login" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;