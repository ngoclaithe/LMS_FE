import React, { useState, useEffect } from 'react';
import LayoutAdminDashboard from '../../components/layoutadmin/LayoutAdmin';
import { getAllCourses, createCourse, getCourseById, updateCourse, deleteCourse } from '../../services/apiCourse';
import { Button, Table, Modal, Form, Input, DatePicker, InputNumber, Upload, message, Popconfirm, Spin, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import uploadImage from '../../utils/upload_image';

const { Option } = Select;

const courseTypeMap = {
  'Public': 'Công khai',
  'major': 'Chuyên ngành',
  'outline': 'Đại cương',
  'industry base': 'Cơ sở ngành'
};

const CoursePage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('Thêm Mới Khóa Học');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [form] = Form.useForm();
    const [avatarUrl, setAvatarUrl] = useState('');

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const data = await getAllCourses();
            setCourses(data);
        } catch (error) {
            message.error('Không thể tải danh sách khóa học');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleImageUpload = async (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Bạn chỉ có thể tải lên file ảnh!');
            return false;
        }

        const isLessThan2MB = file.size / 1024 / 1024 < 2;
        if (!isLessThan2MB) {
            message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
            return false;
        }

        setUploadingImage(true);
        message.loading('Đang tải ảnh lên Cloudinary...', 0);

        try {
            const cloudinaryUrl = await uploadImage(file);
            
            setAvatarUrl(cloudinaryUrl);
            form.setFieldsValue({ avatar: cloudinaryUrl });
            
            message.success('Tải ảnh lên thành công!');
        } catch (error) {
            message.error('Có lỗi xảy ra khi tải ảnh lên: ' + (error.message || 'Unknown error'));
            console.error('Image upload error:', error);
        } finally {
            setUploadingImage(false);
            message.destroy(); 
        }
        
        return false; 
    };

    const showAddModal = () => {
        setModalTitle('Thêm Mới Khóa Học');
        setSelectedCourse(null);
        setAvatarUrl('');
        form.resetFields();
        setModalVisible(true);
    };

    const showEditModal = async (id_course) => {
        setLoading(true);
        try {
            const courseData = await getCourseById(id_course);
            setSelectedCourse(courseData);
            setModalTitle('Chỉnh Sửa Khóa Học');
            setAvatarUrl(courseData.avatar || '');
            form.setFieldsValue({
                ...courseData,
                start_date: courseData.start_date ? moment(courseData.start_date) : null,
                end_date: courseData.end_date ? moment(courseData.end_date) : null
            });
            setModalVisible(true);
        } catch (error) {
            message.error('Không thể tải thông tin khóa học');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const courseData = {
                ...values,
                start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : null,
                end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : null,
                avatar: avatarUrl,
                user_create: values.user_create || ""
            };

            if (selectedCourse) {
                await updateCourse(selectedCourse.id_course, courseData);
                message.success('Cập nhật khóa học thành công');
            } else {
                await createCourse(courseData);
                message.success('Thêm mới khóa học thành công');
            }

            setModalVisible(false);
            fetchCourses();
        } catch (error) {
            message.error('Có lỗi xảy ra khi lưu thông tin');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id_course) => {
        setLoading(true);
        try {
            await deleteCourse(id_course);
            message.success('Xóa khóa học thành công');
            fetchCourses();
        } catch (error) {
            message.error('Không thể xóa khóa học');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id_course',
            key: 'id_course',
            width: 50
        },
        {
            title: 'Ảnh',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 100,
            render: (avatar) => (
                avatar ? <img src={avatar} alt="avatar" style={{ width: 50, height: 50, objectFit: 'cover' }} /> : null
            )
        },
        {
            title: 'Tên Khóa Học',
            dataIndex: 'course_name',
            key: 'course_name',
        },
        {
            title: 'Mô Tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: 'Loại Khóa Học',
            dataIndex: 'course_type',
            key: 'course_type',
            render: (type) => courseTypeMap[type] || type || 'Chưa phân loại'
        },
        {
            title: 'Ngày Bắt Đầu',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (date) => date ? moment(date).format('DD/MM/YYYY') : ''
        },
        {
            title: 'Ngày Kết Thúc',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (date) => date ? moment(date).format('DD/MM/YYYY') : ''
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => price?.toLocaleString() + ' VNĐ'
        },
        {
            title: 'Thao Tác',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />} 
                        onClick={() => showEditModal(record.id_course)}
                        size="small"
                    />
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa khóa học này?"
                        onConfirm={() => handleDelete(record.id_course)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button 
                            type="primary" 
                            danger 
                            icon={<DeleteOutlined />} 
                            size="small"
                        />
                    </Popconfirm>
                </div>
            )
        },
    ];

    return (
        <LayoutAdminDashboard>
            <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Quản Lý Khóa Học</h1>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={showAddModal}
                    >
                        Thêm Khóa Học
                    </Button>
                </div>

                <Table 
                    columns={columns} 
                    dataSource={courses} 
                    rowKey="id_course" 
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />

                <Modal
                    title={modalTitle}
                    visible={modalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width={800}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{ user_create: "", course_type: "Public" }}
                    >
                        <Form.Item
                            name="course_name"
                            label="Tên Khóa Học"
                            rules={[{ required: true, message: 'Vui lòng nhập tên khóa học' }]}
                        >
                            <Input placeholder="Nhập tên khóa học" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Mô Tả"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập mô tả khóa học" />
                        </Form.Item>

                        <Form.Item
                            name="course_type"
                            label="Loại Khóa Học"
                            rules={[{ required: true, message: 'Vui lòng chọn loại khóa học' }]}
                        >
                            <Select placeholder="Chọn loại khóa học">
                                <Option value="Public">Công khai</Option>
                                <Option value="major">Chuyên ngành</Option>
                                <Option value="outline">Đại cương</Option>
                                <Option value="industry base">Cơ sở ngành</Option>
                            </Select>
                        </Form.Item>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <Form.Item
                                name="start_date"
                                label="Ngày Bắt Đầu"
                                style={{ flex: 1 }}
                                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                            >
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>

                            <Form.Item
                                name="end_date"
                                label="Ngày Kết Thúc"
                                style={{ flex: 1 }}
                                rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                            >
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="price"
                            label="Giá"
                            rules={[{ required: true, message: 'Vui lòng nhập giá khóa học' }]}
                        >
                            <InputNumber 
                                style={{ width: '100%' }} 
                                placeholder="Nhập giá khóa học" 
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                addonAfter="VNĐ"
                            />
                        </Form.Item>

                        <Form.Item
                            name="avatar"
                            label="Ảnh Đại Diện"
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Upload
                                    listType="picture-card"
                                    showUploadList={false}
                                    beforeUpload={handleImageUpload}
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? (
                                        <div style={{ textAlign: 'center' }}>
                                            <Spin size="small" />
                                            <div style={{ marginTop: 8 }}>Đang tải...</div>
                                        </div>
                                    ) : avatarUrl ? (
                                        <img src={avatarUrl} alt="avatar" style={{ width: '100%' }} />
                                    ) : (
                                        <div>
                                            <UploadOutlined />
                                            <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                                        </div>
                                    )}
                                </Upload>
                                {avatarUrl && (
                                    <div style={{ color: 'green', wordBreak: 'break-all' }}>
                                        URL Cloudinary: {avatarUrl}
                                    </div>
                                )}
                            </div>
                        </Form.Item>

                        <Form.Item
                            name="user_create"
                            label="Người Tạo"
                            hidden
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item style={{ marginTop: '20px', textAlign: 'right' }}>
                            <Button style={{ marginRight: '10px' }} onClick={handleCancel}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {selectedCourse ? 'Cập Nhật' : 'Thêm Mới'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </LayoutAdminDashboard>
    );
};

export default CoursePage;