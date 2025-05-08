import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { vehicleAPI } from '../../services/api';

const VehicleForm = () => {
  // Lấy id từ URL nếu đang ở chế độ sửa
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // State cho form
  const [formData, setFormData] = useState({
    licensePlate: '',
    ownerName: '',
    vehicleType: '',
    registrationDate: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Nếu đang ở chế độ sửa, tải thông tin xe
  useEffect(() => {
    if (isEditMode) {
      fetchVehicleData();
    }
  }, [id]);
  
  // Hàm lấy thông tin xe cần sửa
  const fetchVehicleData = async () => {
    try {
      setLoading(true);
      const response = await vehicleAPI.getVehicleById(id);
      
      // Format ngày tháng để hiển thị trong form
      const vehicle = response.data;
      if (vehicle.registrationDate) {
        // Chuyển đổi định dạng ngày từ ISO string sang yyyy-MM-dd cho input type="date"
        const date = new Date(vehicle.registrationDate);
        vehicle.registrationDate = date.toISOString().split('T')[0];
      }
      
      setFormData(vehicle);
      setError('');
    } catch (err) {
      console.error('Lỗi khi tải thông tin xe:', err);
      setError('Không thể tải thông tin xe. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      
      if (isEditMode) {
        // Cập nhật xe
        await vehicleAPI.updateVehicle(id, formData);
        setSuccess('Cập nhật xe thành công!');
      } else {
        // Thêm xe mới
        await vehicleAPI.createVehicle(formData);
        setSuccess('Thêm xe mới thành công!');
        // Reset form sau khi thêm thành công
        setFormData({
          licensePlate: '',
          ownerName: '',
          vehicleType: '',
          registrationDate: ''
        });
      }
      
      // Sau 1.5 giây, chuyển về trang danh sách
      setTimeout(() => {
        navigate('/vehicles');
      }, 1500);
      
    } catch (err) {
      console.error('Lỗi khi lưu thông tin xe:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Kiểm tra form trước khi submit
  const validateForm = () => {
    if (!formData.licensePlate.trim()) {
      setError('Vui lòng nhập biển số xe');
      return false;
    }
    
    if (!formData.ownerName.trim()) {
      setError('Vui lòng nhập tên chủ sở hữu');
      return false;
    }
    
    if (!formData.vehicleType.trim()) {
      setError('Vui lòng chọn loại xe');
      return false;
    }
    
    if (!formData.registrationDate) {
      setError('Vui lòng chọn ngày đăng ký');
      return false;
    }
    
    return true;
  };
  
  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">{isEditMode ? 'Sửa Thông Tin Xe' : 'Thêm Xe Mới'}</h3>
        </Card.Header>
        
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Biển Số Xe <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập biển số xe (VD: 51H-123.45)"
                        name="licensePlate"
                        value={formData.licensePlate}
                        onChange={handleChange}
                        disabled={submitting}
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Chủ Sở Hữu <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập tên chủ sở hữu"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        disabled={submitting}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Loại Xe <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        disabled={submitting}
                        required
                      >
                        <option value="">-- Chọn loại xe --</option>
                        <option value="Ô tô">Ô tô</option>
                        <option value="Xe máy">Xe máy</option>
                        <option value="Xe tải">Xe tải</option>
                        <option value="Xe khách">Xe khách</option>
                        <option value="Xe đầu kéo">Xe đầu kéo</option>
                        <option value="Xe đặc chủng">Xe đặc chủng</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ngày Đăng Ký <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="date"
                        name="registrationDate"
                        value={formData.registrationDate}
                        onChange={handleChange}
                        disabled={submitting}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="mt-4 d-flex justify-content-between">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/vehicles')}
                    disabled={submitting}
                  >
                    Quay Lại
                  </Button>
                  
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? 'Đang lưu...' : (isEditMode ? 'Cập Nhật' : 'Thêm Mới')}
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VehicleForm;