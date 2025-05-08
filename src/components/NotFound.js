import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Navbar from './Navbar';  // vì cùng nằm trong thư mục components
import Login from './Login';
import Dashboard from './Dashboard';
import VehicleList from './vehicle/VehicleList';
import VehicleForm from './vehicle/VehicleForm';
import NotFound from './NotFound';

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