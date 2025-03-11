import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FaCalendarAlt, FaClock, FaInfoCircle, FaMoneyBillWave, FaUser, FaEnvelope, FaPhone, FaCheckCircle } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import { getCourseById } from '../services/apiCourse';
import { enrollCourse } from '../services/apiEnroll';

const EnrollPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    note: ''
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const courseData = await getCourseById(id);
        setCourse(courseData);
        
        const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
        if (userData) {
          setFormData(prevData => ({
            ...prevData,
            fullName: userData.full_name || '',
            email: userData.email || '',
            phone: userData.phone || ''
          }));
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin khóa học:', error);
        setError('Không thể tải thông tin khóa học. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseData();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setEnrolling(true);
      
      const userId = JSON.parse(sessionStorage.getItem('userData') || '{}').id;
      
      if (!userId) {
        setError('Bạn cần đăng nhập để đăng ký khóa học');
        navigate('/login', { state: { redirectTo: `/courses/${id}/enroll` } });
        return;
      }
      
      const enrollmentData = {
        id_course: id,
        id_user: userId,
        enrollment_date: new Date().toISOString(),
        note: formData.note
      };
      
      const result = await enrollCourse(enrollmentData);
      
      if (result.success) {
        setEnrollSuccess(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          note: ''
        });
        
        setTimeout(() => {
          navigate(`/courses/${id}`);
        }, 3000);
      } else {
        setError(result.message || 'Đăng ký không thành công. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký khóa học:', error);
      setError('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="loader animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !enrollSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Lỗi! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => navigate(`/courses/${id}`)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
            >
              Quay lại thông tin khóa học
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (enrollSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
            <div className="text-center">
              <FaCheckCircle className="mx-auto text-green-500 text-5xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">Đăng ký thành công!</h2>
              <p className="text-gray-600 mb-6">Bạn đã đăng ký khóa học "{course.course_name}" thành công.</p>
              <button 
                onClick={() => navigate(`/courses/${id}`)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
              >
                Quay lại trang khóa học
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate(`/courses/${id}`)}
              className="mr-3 text-gray-600 hover:text-blue-500"
            >
              &larr; Quay lại
            </button>
            <h1 className="text-2xl font-bold">Đăng ký khóa học</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-8">

            <div className="w-full md:w-2/3">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Thông tin đăng ký</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <span className="px-3 py-2 bg-gray-100 text-gray-500">
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 focus:outline-none"
                        placeholder="Nhập họ tên của bạn"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <span className="px-3 py-2 bg-gray-100 text-gray-500">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 focus:outline-none"
                        placeholder="Nhập email của bạn"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <span className="px-3 py-2 bg-gray-100 text-gray-500">
                        <FaPhone />
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 focus:outline-none"
                        placeholder="Nhập số điện thoại của bạn"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="note" className="block text-gray-700 font-medium mb-2">
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt (nếu có)"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center"
                      disabled={enrolling}
                    >
                      {enrolling ? (
                        <>
                          <span className="loader inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Đang xử lý...
                        </>
                      ) : 'Xác nhận đăng ký'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Course Info */}
            <div className="w-full md:w-1/3">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Thông tin khóa học</h3>
                
                <div className="mb-4">
                  <img 
                    src={course?.avatar || '/default-course-cover.jpg'} 
                    alt={course?.course_name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = '/default-course-cover.jpg';
                    }}
                  />
                  <h4 className="font-bold text-lg">{course?.course_name}</h4>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <FaCalendarAlt className="text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium">Thời gian học</p>
                      <p className="text-gray-600">
                        {formatDate(course?.start_date)} - {formatDate(course?.end_date)}
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <FaMoneyBillWave className="text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium">Học phí</p>
                      <p className="text-gray-600">
                        {course?.price > 0 ? `${course?.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <FaInfoCircle className="text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium">Loại khóa học</p>
                      <p className="text-gray-600 capitalize">
                        {course?.course_type || 'Chưa phân loại'}
                      </p>
                    </div>
                  </li>
                </ul>
                
                {course?.price > 0 && (
                  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-700 text-sm">
                      <strong>Lưu ý:</strong> Bạn sẽ nhận được hướng dẫn thanh toán sau khi hoàn tất đăng ký.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EnrollPage;