import React, { useState, useEffect } from 'react';
import LayoutAdminDashboard from '../../components/layoutadmin/LayoutAdmin';
import { 
  getAllCoursesByCourseName 
} from '../../services/apiCourse';
import { 
  createLesson, 
  getLessonByIdCourse, 
  deleteLesson, 
  updateLesson 
} from '../../services/apiLesson';
import { 
  createDocument, 
  getDocumentByIdLesson, 
  updateDocument, 
  deleteDocument 
} from '../../services/apiDocument';
import { 
  Button, Card, Modal, Form, Input, DatePicker, InputNumber, Upload, message, 
  Popconfirm, Spin, Select, Row, Col, Typography, Collapse, Table, List, Tag, Space 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const UpdateCoursePage = () => {
  // State cho khóa học
  const [searchText, setSearchText] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // State cho Lesson và Document
  const [lessons, setLessons] = useState([]);
  const [documents, setDocuments] = useState({}); // { lessonId: [docs] }
  const [expandedLessonId, setExpandedLessonId] = useState(null);

  // Modal control cho lesson
  const [lessonModalVisible, setLessonModalVisible] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null); // null: create, object: update

  // Modal control cho document (dành cho từng lesson)
  const [docModalVisible, setDocModalVisible] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [currentLessonForDoc, setCurrentLessonForDoc] = useState(null);

  const [lessonForm] = Form.useForm();
  const [docForm] = Form.useForm();

  // Hàm tìm khóa học theo tên
  const handleSearch = async (value) => {
    setSearchText(value);
    try {
      const result = await getAllCoursesByCourseName(value);
      setCourses(result);
    } catch (error) {
      console.log("không tìm thấy");
    }
  };

  // Khi chọn 1 khóa học
  const handleSelectCourse = async (courseId) => {
    const course = courses.find(c => c.id_course === courseId);
    setSelectedCourse(course);
    // Load lessons cho khóa học
    try {
      const lessonsData = await getLessonByIdCourse(courseId);
      setLessons(lessonsData);
      // Load document cho từng lesson
      const docsMap = {};
      for (const lesson of lessonsData) {
        try {
          const docs = await getDocumentByIdLesson(lesson.id_lesson);
          docsMap[lesson.id_lesson] = docs;
        } catch (error) {
          docsMap[lesson.id_lesson] = [];
        }
      }
      setDocuments(docsMap);
    } catch (error) {
      console.log('Lỗi khi tải bài giảng của khóa học');
    }
  };

  // ====== Lesson CRUD ======
  const openLessonModal = (lesson = null) => {
    setCurrentLesson(lesson);
    setLessonModalVisible(true);
    if (lesson) {
      lessonForm.setFieldsValue(lesson);
    } else {
      lessonForm.resetFields();
    }
  };

  const handleLessonSubmit = async () => {
    try {
      const values = await lessonForm.validateFields();
      if (currentLesson) {
        // Update
        const updated = await updateLesson(currentLesson.id_lesson, values);
        setLessons(prev => prev.map(item => item.id_lesson === updated.id_lesson ? updated : item));
        message.success('Cập nhật bài giảng thành công');
      } else {
        // Create (gắn thêm id_course từ khóa học đã chọn)
        const newLesson = await createLesson({ ...values, id_course: selectedCourse.id_course });
        setLessons(prev => [...prev, newLesson]);
        message.success('Tạo bài giảng thành công');
      }
      setLessonModalVisible(false);
      lessonForm.resetFields();
    } catch (error) {
      message.error('Lỗi khi lưu bài giảng');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await deleteLesson(lessonId);
      setLessons(prev => prev.filter(item => item.id_lesson !== lessonId));
      // Xóa luôn các document tương ứng nếu có
      setDocuments(prev => {
        const newDocs = { ...prev };
        delete newDocs[lessonId];
        return newDocs;
      });
      message.success('Xóa bài giảng thành công');
    } catch (error) {
      message.error('Lỗi khi xóa bài giảng');
    }
  };

  // ====== Document CRUD ======
  const openDocModal = (lesson, doc = null) => {
    setCurrentLessonForDoc(lesson);
    setCurrentDoc(doc);
    setDocModalVisible(true);
    if (doc) {
      docForm.setFieldsValue(doc);
    } else {
      docForm.resetFields();
    }
  };

  const handleDocSubmit = async () => {
    try {
      const values = await docForm.validateFields();
      if (currentDoc) {
        // Update document
        const updated = await updateDocument(currentDoc.id_document, values);
        setDocuments(prev => {
          const newDocs = { ...prev };
          newDocs[currentLessonForDoc.id_lesson] = newDocs[currentLessonForDoc.id_lesson].map(doc =>
            doc.id_document === updated.id_document ? updated : doc
          );
          return newDocs;
        });
        message.success('Cập nhật tài liệu thành công');
      } else {
        // Create document, gắn id_lesson của lesson hiện tại
        const newDoc = await createDocument({ ...values, id_lesson: currentLessonForDoc.id_lesson });
        setDocuments(prev => {
          const newDocs = { ...prev };
          newDocs[currentLessonForDoc.id_lesson] = newDocs[currentLessonForDoc.id_lesson]
            ? [...newDocs[currentLessonForDoc.id_lesson], newDoc]
            : [newDoc];
          return newDocs;
        });
        message.success('Tạo tài liệu thành công');
      }
      setDocModalVisible(false);
      docForm.resetFields();
    } catch (error) {
      message.error('Lỗi khi lưu tài liệu');
    }
  };

  const handleDeleteDocument = async (lessonId, docId) => {
    try {
      await deleteDocument(docId);
      setDocuments(prev => {
        const newDocs = { ...prev };
        newDocs[lessonId] = newDocs[lessonId].filter(doc => doc.id_document !== docId);
        return newDocs;
      });
      message.success('Xóa tài liệu thành công');
    } catch (error) {
      message.error('Lỗi khi xóa tài liệu');
    }
  };

  const toggleLessonExpand = (lessonId) => {
    if (expandedLessonId === lessonId) {
      setExpandedLessonId(null);
    } else {
      setExpandedLessonId(lessonId);
    }
  };

  // ====== Render ======
  return (
    <LayoutAdminDashboard>
      <div style={{ padding: '20px' }}>
        <Title level={2}>Tìm kiếm khóa học</Title>
        <Select
          showSearch
          placeholder="Nhập tên khóa học"
          optionFilterProp="children"
          style={{ width: '100%', marginBottom: '20px' }}
          onSearch={handleSearch}
          onChange={handleSelectCourse}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {courses.map(course => (
            <Option key={course.id_course} value={course.id_course}>
              {course.course_name}
            </Option>
          ))}
        </Select>

        {selectedCourse && (
          <div>
            <Card>
              <Title level={3}>Thông tin khóa học: {selectedCourse.course_name}</Title>
              <div style={{ marginBottom: '20px' }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openLessonModal()}
                >
                  Tạo bài giảng mới
                </Button>
              </div>

              {/* Lessons hiển thị theo dạng list ngang */}
              <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id_lesson} style={{ marginRight: '15px' }}>
                      <Card
                        hoverable
                        style={{
                          width: 280,
                          marginBottom: '15px',
                          borderColor: expandedLessonId === lesson.id_lesson ? '#1890ff' : undefined,
                          boxShadow: expandedLessonId === lesson.id_lesson ? '0 0 10px rgba(24, 144, 255, 0.5)' : undefined
                        }}
                        onClick={() => toggleLessonExpand(lesson.id_lesson)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <Tag color="blue">Bài {lesson.order || index + 1}</Tag>
                          </div>
                          <div>
                            {expandedLessonId === lesson.id_lesson ? <DownOutlined /> : <RightOutlined />}
                          </div>
                        </div>
                        <Title level={4} style={{ margin: '10px 0' }}>{lesson.title}</Title>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                          <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              openLessonModal(lesson);
                            }}
                          >
                            Sửa
                          </Button>
                          <Popconfirm
                            title="Bạn có chắc muốn xóa?"
                            onConfirm={(e) => {
                              e.stopPropagation();
                              handleDeleteLesson(lesson.id_lesson);
                            }}
                            onCancel={(e) => e.stopPropagation()}
                          >
                            <Button
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Xóa
                            </Button>
                          </Popconfirm>
                        </div>
                      </Card>

                      {/* Hiển thị documents khi mở rộng */}
                      {expandedLessonId === lesson.id_lesson && (
                        <Card
                          title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>Tài liệu của bài giảng</span>
                              <Button
                                type="primary"
                                size="small"
                                icon={<PlusOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDocModal(lesson);
                                }}
                              >
                                Thêm tài liệu
                              </Button>
                            </div>
                          }
                          bordered={false}
                          style={{ width: 280 }}
                        >
                          <div className="lesson-details">
                            <div style={{ marginBottom: '15px' }}>
                              <Text strong>Nội dung:</Text>
                              <div>{lesson.content}</div>
                            </div>
                            
                            {lesson.video_url && (
                              <div style={{ marginBottom: '15px' }}>
                                <Text strong>Video URL:</Text>
                                <div>{lesson.video_url}</div>
                              </div>
                            )}
                            
                            <List
                              size="small"
                              dataSource={documents[lesson.id_lesson] || []}
                              renderItem={doc => (
                                <List.Item
                                  actions={[
                                    <Button
                                      size="small"
                                      icon={<EditOutlined />}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDocModal(lesson, doc);
                                      }}
                                    />,
                                    <Popconfirm
                                      title="Bạn có chắc muốn xóa tài liệu này?"
                                      onConfirm={(e) => {
                                        e.stopPropagation();
                                        handleDeleteDocument(lesson.id_lesson, doc.id_document);
                                      }}
                                      onCancel={(e) => e.stopPropagation()}
                                    >
                                      <Button
                                        danger
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </Popconfirm>
                                  ]}
                                >
                                  <List.Item.Meta
                                    title={doc.title}
                                    description={doc.description}
                                  />
                                </List.Item>
                              )}
                              locale={{ emptyText: "Chưa có tài liệu" }}
                            />
                          </div>
                        </Card>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

{/* Modal Lesson */}
<Modal
        title={currentLesson ? "Cập nhật bài giảng" : "Tạo bài giảng"}
        visible={lessonModalVisible}
        onCancel={() => { setLessonModalVisible(false); lessonForm.resetFields(); }}
        onOk={handleLessonSubmit}
      >
        <Form form={lessonForm} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="video_url" label="Video URL">
            <Input />
          </Form.Item>
          <Form.Item name="order" label="Thứ tự">
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Document */}
      <Modal
        title={currentDoc ? "Cập nhật tài liệu" : "Tạo tài liệu"}
        visible={docModalVisible}
        onCancel={() => { setDocModalVisible(false); docForm.resetFields(); }}
        onOk={handleDocSubmit}
      >
        <Form form={docForm} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="file_url" label="File URL" rules={[{ required: true, message: 'Vui lòng nhập đường dẫn file' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="uploaded_by" label="Người upload">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </LayoutAdminDashboard>
  );
};

export default UpdateCoursePage;