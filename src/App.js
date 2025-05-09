import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VehicleList from './components/vehicle/VehicleList';
import VehicleForm from './components/vehicle/VehicleForm';
import NotFound from './components/NotFound';

// Auth Guard Component
const PrivateRoute = ({ children }) => {
  // Kiểm tra xem người dùng đã đăng nhập chưa
  const isAuthenticated = localStorage.getItem('user') !== null;
  
  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Nếu đã đăng nhập, hiển thị component con
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Container fluid className="p-0">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/vehicles" element={
              <PrivateRoute>
                <VehicleList />
              </PrivateRoute>
            } />
            <Route path="/vehicles/add" element={
              <PrivateRoute>
                <VehicleForm />
              </PrivateRoute>
            } />
            <Route path="/vehicles/edit/:id" element={
              <PrivateRoute>
                <VehicleForm />
              </PrivateRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;