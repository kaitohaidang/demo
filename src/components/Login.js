import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { authAPI } from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra form
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin đăng nhập');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Gọi API đăng nhập
      await authAPI.login(username, password);
      
      // Chuyển hướng đến trang chính
      navigate('/dashboard');
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      
      // Hiển thị thông báo lỗi
      setError(
        error.response?.data?.message || 
        'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="border-0 shadow">
            <Card.Header className="bg-primary text-white text-center p-4">
              <h3>Đăng Nhập</h3>
              <p className="mb-0">Hệ thống quản lý và nhận diện biển số xe</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Tên đăng nhập</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    className="py-2"
                  >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </div>
              </Form>
              
            
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;