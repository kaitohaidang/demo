import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card, Row, Col, Form, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { vehicleAPI, authAPI } from '../../services/api';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = authAPI.getCurrentUser();
  
  // Tải danh sách xe khi component được mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Hàm lấy danh sách xe từ API
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleAPI.getAllVehicles();
      setVehicles(response.data);
      setError('');
    } catch (error) {
      console.error("Lỗi khi tải danh sách xe:", error);
      setError('Không thể tải danh sách xe. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa xe
  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa xe này?')) {
      try {
        await vehicleAPI.deleteVehicle(id);
        // Cập nhật lại danh sách xe sau khi xóa
        setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
        alert('Xóa xe thành công!');
      } catch (error) {
        console.error("Lỗi khi xóa xe:", error);
        alert('Lỗi khi xóa xe: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Lọc danh sách xe theo từ khóa tìm kiếm
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0">Quản Lý Xe</h3>
            </Col>
            <Col className="text-end">
              <Link to="/vehicles/add">
                <Button variant="success">
                  <i className="bi bi-plus-circle me-2"></i>Thêm Xe Mới
                </Button>
              </Link>
            </Col>
          </Row>
        </Card.Header>
        
        <Card.Body>
          {/* Thanh tìm kiếm */}
          <Row className="mb-3">
            <Col md={6} className="mx-auto">
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm theo biển số, chủ sở hữu hoặc loại xe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Hiển thị lỗi nếu có */}
          {error && <Alert variant="danger">{error}</Alert>}
          
          {/* Hiển thị loading */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : filteredVehicles.length > 0 ? (
            <Table striped hover responsive>
              <thead className="bg-light">
                <tr>
                  <th>STT</th>
                  <th>Biển Số Xe</th>
                  <th>Chủ Sở Hữu</th>
                  <th>Loại Xe</th>
                  <th>Ngày Đăng Ký</th>
                  <th className="text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle, index) => (
                  <tr key={vehicle.id}>
                    <td>{index + 1}</td>
                    <td>{vehicle.licensePlate}</td>
                    <td>{vehicle.ownerName}</td>
                    <td>{vehicle.vehicleType}</td>
                    <td>{formatDate(vehicle.registrationDate)}</td>
                    <td className="text-center">
                      <Link to={`/vehicles/edit/${vehicle.id}`} className="btn btn-sm btn-info me-2">
                        Sửa
                      </Link>
                      {currentUser?.role === 'ADMIN' && (
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                        >
                          Xóa
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info" className="text-center">
              Không tìm thấy dữ liệu xe nào.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VehicleList;