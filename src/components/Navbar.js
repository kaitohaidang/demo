import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as RBNavbar, Nav, Container, Button } from 'react-bootstrap';
import { authAPI } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = authAPI.getCurrentUser();
  
  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };
  
  // Nếu chưa đăng nhập, không hiển thị Navbar
  if (!currentUser) return null;
  
  return (
    <RBNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <RBNavbar.Brand as={Link} to="/dashboard">Hệ Thống Quản Lý Xe</RBNavbar.Brand>
        <RBNavbar.Toggle aria-controls="navbar-nav" />
        <RBNavbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Trang Chủ</Nav.Link>
            <Nav.Link as={Link} to="/vehicles">Quản Lý Xe</Nav.Link>
            {currentUser.role === 'ADMIN' && (
              <Nav.Link as={Link} to="/admin">Quản Trị</Nav.Link>
            )}
          </Nav>
          <Nav>
            <Nav.Item className="d-flex align-items-center me-3">
              <span className="text-light">
                Xin chào, {currentUser.username}
                {currentUser.role === 'ADMIN' && (
                  <span className="ms-2 badge bg-danger">Admin</span>
                )}
              </span>
            </Nav.Item>
            <Button variant="outline-light" onClick={handleLogout}>
              Đăng Xuất
            </Button>
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
};

export default Navbar;