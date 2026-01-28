import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Members } from './pages/Members';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { group } = useApp();
  
  if (!group) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { group } = useApp();

  return (
    <Routes>
      <Route path="/" element={group ? <Navigate to="/home" replace /> : <Login />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <Members />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
