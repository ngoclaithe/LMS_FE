import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaIdBadge, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import { getDetailStudentById } from '../services/apiDetailStudent';

const ProfilePage = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const userId = sessionStorage.getItem('user_id');

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const data = await getDetailStudentById(userId);
                setStudent(data);
            } catch (err) {
                setError('Không tìm thấy thông tin sinh viên.');
            } finally {
                setLoading(false);
            }
        };
        
        if (userId) {
            fetchStudentDetails();
        } else {
            setError('Không tìm thấy ID người dùng trong phiên làm việc.');
            setLoading(false);
        }
    }, [userId]);

    if (loading) return <p>Đang tải thông tin sinh viên...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Layout>
            <div className="profile-container">
                <h2><FaUser /> Hồ sơ sinh viên</h2>
                {student && (
                    <div className="profile-details">
                        <p><FaIdBadge /> Mã sinh viên: {student.code_student_by_university}</p>
                        <p><FaUser /> Họ và tên: {student.full_name || 'Chưa cập nhật'}</p>
                        <p><FaEnvelope /> Email: {student.email || 'Chưa cập nhật'}</p>
                        <p><FaPhone /> Số điện thoại: {student.phone || 'Chưa cập nhật'}</p>
                        <p><FaGraduationCap /> Chương trình đào tạo: {student.training_program}</p>
                        <p><FaCalendarAlt /> Năm nhập học: {student.year_of_admission}</p>
                        <p><FaCheckCircle /> Lớp: {student.class_student}</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ProfilePage;