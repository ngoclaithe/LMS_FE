import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FaCalendarAlt, FaClock, FaInfoCircle, FaMoneyBillWave } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import { getCourseById } from '../services/apiCourse';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const courseData = await getCourseById(id);
        setCourse(courseData);
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

  if (error || !course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Lỗi! </strong>
            <span className="block sm:inline">{error || 'Không tìm thấy khóa học này.'}</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">

        <div className="relative w-full h-64 rounded-xl overflow-hidden mb-8">
          <img
            src={course.avatar || '/default-course-cover.jpg'}
            alt={course.course_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-course-cover.jpg';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="p-6 text-white">
              <div className="inline-block px-3 py-1 mb-3 rounded bg-blue-500 text-white text-sm font-medium">
                {course.course_type?.toUpperCase() || 'KHÓA HỌC'}
              </div>
              <h1 className="text-3xl font-bold mb-2">{course.course_name}</h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Giới thiệu khóa học</h2>
              <div className="prose max-w-none">
                <p>{course.description || 'Chưa có mô tả chi tiết cho khóa học này.'}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Nội dung khóa học</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-lg">Thông tin đang được cập nhật</h3>
                  <p className="text-gray-600">Nội dung chi tiết của khóa học sẽ sớm được cập nhật.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Thông tin khóa học</h3>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <FaCalendarAlt className="text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Thời gian học</p>
                    <p className="text-gray-600">
                      {formatDate(course.start_date)} - {formatDate(course.end_date)}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <FaMoneyBillWave className="text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Học phí</p>
                    <p className="text-gray-600">
                      {course.price > 0 ? `${course.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <FaInfoCircle className="text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Loại khóa học</p>
                    <p className="text-gray-600 capitalize">
                      {course.course_type || 'Chưa phân loại'}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <FaClock className="text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Ngày tạo</p>
                    <p className="text-gray-600">
                      {formatDate(course.created_at)}
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-6">
                <button
                  onClick={() => navigate(`/courses/${id}/enroll`)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
                >
                  Đăng ký khóa học
                </button>

                {course.price === 0 && (
                  <p className="text-center text-green-600 mt-2 text-sm font-medium">
                    Khóa học này hoàn toàn miễn phí!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetailPage;