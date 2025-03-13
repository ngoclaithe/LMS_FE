import React, { useState, useEffect } from 'react';
import LayoutAdminDashboard from '../../components/layoutadmin/LayoutAdmin';
import {
    getDetailStudentById,
    createDetailStudent,
    deleteDetailStudent,
    updateDetailStudent
} from '../../services/apiDetailStudent';
import { getAllStudents, createUser, deleteUser } from '../../services/apiUser';
import {
    Button,
    Table,
    Modal,
    Form,
    Input,
    DatePicker,
    message,
    Popconfirm,
    Spin,
    Avatar,
    Space,
    Typography,
    Divider,
    Card,
    Upload,
    Select
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    InfoCircleOutlined,
    ExclamationCircleOutlined,
    UploadOutlined
} from '@ant-design/icons';
import moment from 'moment';
import uploadImage from '../../utils/upload_image';

const { Title, Text } = Typography;
const { Option } = Select;

const ManageStudent = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState({});
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [detailStudent, setDetailStudent] = useState(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [formCreate] = Form.useForm();
    const [formDetail] = Form.useForm();

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const data = await getAllStudents();
            setStudents(data);
        } catch (error) {
            message.error('Lỗi khi tải danh sách sinh viên');
        }
        setLoading(false);
    };

    const fetchDetailStudent = async (id) => {
        setButtonLoading(prev => ({ ...prev, [id]: true }));
        try {
            const detail = await getDetailStudentById(id);
            console.log("Giá trị detail là:", detail);

            if (detail.message === "noinfo") {
                console.log("Trường hợp bằng noinfo");
                setDetailStudent(null);
                formDetail.resetFields();
                const student = students.find(s => s.id_user === id);
                if (student) {
                    formDetail.setFieldsValue({
                        full_name: student.full_name,
                        email: student.email
                    });
                }
                setAvatarUrl('');
            } else {
                setDetailStudent(detail);
                formDetail.setFieldsValue({
                    ...detail,
                    birthdate: detail.birthdate ? moment(detail.birthdate) : null
                });
                setAvatarUrl(detail.avatar || '');
            }
        } catch (error) {
            setDetailStudent(null);
            formDetail.resetFields();
            setAvatarUrl('');
        }
        setButtonLoading(prev => ({ ...prev, [id]: false }));
    };

    const openCreateModal = () => {
        setSelectedStudent(null);
        setDetailStudent(null);
        formCreate.resetFields();
        setIsCreateModalVisible(true);
    };

    const openDetailModal = (record) => {
        setSelectedStudent(record);
        fetchDetailStudent(record.id_user);
        setIsDetailModalVisible(true);
    };

    const handleCreateUser = async (values) => {
        setLoading(true);
        try {
            const newUser = await createUser({
                full_name: values.full_name,
                email: values.email,
                password: values.password,
                role: 'student'
            });
            message.success('Tạo tài khoản sinh viên thành công');
            fetchStudents();
        } catch (error) {
            message.error('Lỗi khi tạo tài khoản sinh viên');
        }
        setLoading(false);
        setIsCreateModalVisible(false);
    };

    const handleCreateOrUpdateDetail = async (values) => {
        setLoading(true);
        try {
            values.year_of_admission = parseInt(values.year_of_admission, 10);
            if (!detailStudent) {
                await createDetailStudent({
                    id_student: selectedStudent.id_user,
                    code_student_by_university: values.code_student_by_university,
                    gender: values.gender,
                    year_of_admission: values.year_of_admission,
                    class_student: values.class_student,
                    training_program: values.training_program,
                    university_year: values.university_year,
                    avatar: values.avatar || ''
                }, token);

                message.success('Tạo thông tin chi tiết sinh viên thành công');
            } else {
                await updateDetailStudent(selectedStudent.id_user, {
                    code_student_by_university: values.code_student_by_university,
                    gender: values.gender,
                    year_of_admission: values.year_of_admission,
                    class_student: values.class_student,
                    training_program: values.training_program,
                    university_year: values.university_year,
                    avatar: values.avatar || ''
                }, token);

                message.success('Cập nhật thông tin sinh viên thành công');
            }
            fetchStudents();
        } catch (error) {
            message.error('Lỗi khi lưu thông tin sinh viên');
        }
        setLoading(false);
        setIsDetailModalVisible(false);
    };

    const handleDelete = async (id) => {
        setButtonLoading(prev => ({ ...prev, [id]: true }));
        try {
            await deleteDetailStudent(id, token);
            await deleteUser(id, token);
            message.success('Xóa sinh viên thành công');
            fetchStudents();
        } catch (error) {
            message.error('Lỗi khi xóa sinh viên');
        }
        setButtonLoading(prev => ({ ...prev, [id]: false }));
    };

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
            formDetail.setFieldsValue({ avatar: cloudinaryUrl });

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

    const showDeleteConfirm = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa thông tin chi tiết của sinh viên này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                handleDelete(id);
            }
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id_user',
            key: 'id_user',
            width: 80
        },
        {
            title: 'Thông tin sinh viên',
            key: 'student_info',
            render: (_, record) => (
                <Space>
                    <Avatar
                        size={40}
                        icon={<UserOutlined />}
                        src={record.avatar}
                    />
                    <Space direction="vertical" size={0}>
                        <Text strong>{record.full_name}</Text>
                        <Text type="secondary">{record.email}</Text>
                    </Space>
                </Space>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 250,
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<InfoCircleOutlined />}
                        onClick={() => openDetailModal(record)}
                        loading={buttonLoading[record.id_user]}
                    >
                        Thông tin chi tiết
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteConfirm(record.id_user)}
                        loading={buttonLoading[record.id_user]}
                    >
                        Xóa
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <LayoutAdminDashboard>
            <Card className="dashboard-card">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Space direction="horizontal" style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Title level={2}>Quản lý sinh viên</Title>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openCreateModal}
                            size="large"
                        >
                            Tạo sinh viên mới
                        </Button>
                    </Space>

                    <Divider />

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={students}
                            rowKey="id_user"
                            pagination={{ pageSize: 10 }}
                            bordered
                            scroll={{ x: 800 }}
                        />
                    )}
                </Space>
            </Card>

            {/* Modal tạo sinh viên mới */}
            <Modal
                title="Tạo sinh viên mới"
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                width={500}
                footer={[
                    <Button key="back" onClick={() => setIsCreateModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => formCreate.submit()}
                        loading={loading}
                    >
                        Tạo mới
                    </Button>,
                ]}
                centered
                destroyOnClose
            >
                <Form
                    form={formCreate}
                    onFinish={handleCreateUser}
                    layout="vertical"
                    requiredMark="optional"
                >
                    <Form.Item
                        name="full_name"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={`Thông tin chi tiết sinh viên: ${selectedStudent?.full_name}`}
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                width={700}
                footer={[
                    <Button key="back" onClick={() => setIsDetailModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => formDetail.submit()}
                        loading={loading}
                    >
                        {!detailStudent ? 'Tạo thông tin' : 'Cập nhật'}
                    </Button>,
                ]}
                centered
                destroyOnClose
            >
                <Form
                    form={formDetail}
                    onFinish={handleCreateOrUpdateDetail}
                    layout="vertical"
                    requiredMark="optional"
                >
                    <div style={{ maxHeight: '60vh', overflow: 'auto', padding: '0 10px' }}>
                        <Form.Item
                            name="code_student_by_university"
                            label="Mã sinh viên theo trường"
                            rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên theo trường' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            label="Giới tính"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                        >
                            <Select placeholder="Chọn giới tính">
                                <Option value="Nam">Nam</Option>
                                <Option value="Nữ">Nữ</Option>
                            </Select>
                        </Form.Item>

                        <Space style={{ width: '100%' }} size="large">
                            <Form.Item
                                name="year_of_admission"
                                label="Năm nhập học"
                                rules={[{ required: true, message: 'Vui lòng nhập năm nhập học' }]}
                                style={{ width: '100%' }}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="university_year"
                                label="Niên khóa"
                                rules={[{ required: true, message: 'Vui lòng nhập niên khóa' }]}
                                style={{ width: '100%' }}
                            >
                                <Input />
                            </Form.Item>
                        </Space>

                        <Space style={{ width: '100%' }} size="large">
                            <Form.Item
                                name="class_student"
                                label="Lớp"
                                rules={[{ required: true, message: 'Vui lòng nhập lớp' }]}
                                style={{ width: '100%' }}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="training_program"
                                label="Chương trình đào tạo"
                                rules={[{ required: true, message: 'Vui lòng nhập chương trình đào tạo' }]}
                                style={{ width: '100%' }}
                            >
                                <Input />
                            </Form.Item>
                        </Space>

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
                    </div>
                </Form>
            </Modal>
        </LayoutAdminDashboard>
    );
};

export default ManageStudent;