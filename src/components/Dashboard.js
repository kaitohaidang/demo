import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Dashboard = () => {
  const currentUser = authAPI.getCurrentUser();
  
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card className="text-center bg-primary text-white mb-4">
            <Card.Body>
              <h2>Chào mừng, {currentUser?.username || 'Người dùng'}!</h2>
              <p className="lead mb-0">Hệ thống quản lý và nhận diện biển số xe</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-info text-white">
              <h4>Quản Lý Xe</h4>
            </Card.Header>
            <Card.Body className="d-flex flex-column">
              <Card.Text>
                Xem và quản lý thông tin đăng ký xe, bao gồm biển số, chủ sở hữu và các thông tin liên quan.
              </Card.Text>
              <div className="mt-auto">
                <Link to="/vehicles" className="d-grid">
                  <Button variant="info">Xem Danh Sách Xe</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-success text-white">
              <h4>Nhận Diện Biển Số</h4>
            </Card.Header>
            <Card.Body className="d-flex flex-column">
              <Card.Text>
                Tải lên video để nhận diện biển số xe và lưu kết quả vào cơ sở dữ liệu hệ thống.
              </Card.Text>
              <div className="mt-auto">
                <Link to="/recognition" className="d-grid">
                  <Button variant="success">
                    Nhận Diện Từ Video
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {currentUser?.role === 'ADMIN' && (
        <Row>
          <Col md={8} className="mx-auto mb-4">
            <Card>
              <Card.Header className="bg-danger text-white">
                <h4>Quản Trị Hệ Thống</h4>
              </Card.Header>
              <Card.Body className="d-flex flex-column">
                <Card.Text>
                  Quản lý người dùng, phân quyền và cấu hình các thông số của hệ thống.
                </Card.Text>
                <div className="mt-auto">
                  <Link to="/admin" className="d-grid">
                    <Button variant="danger">
                      Truy Cập Trang Quản Trị
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;