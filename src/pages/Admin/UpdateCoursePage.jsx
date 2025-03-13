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
  Button, Table, Modal, Form, Input, DatePicker, InputNumber, Upload, message, Popconfirm, Spin, Select 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const UpdateCoursePage = () => {
  // State cho khóa học
  const [searchText, setSearchText] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // State cho Lesson và Document
  const [lessons, setLessons] = useState([]);
  const [documents, setDocuments] = useState({}); // { lessonId: [docs] }

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
      message.error('Lỗi khi tìm khóa học');
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
      message.error('Lỗi khi tải bài giảng của khóa học');
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

  // ====== Render ======
  return (
    <LayoutAdminDashboard>
      <div style={{ padding: '20px' }}>
        <h2>Tìm kiếm khóa học</h2>
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
            <h3>Thông tin khóa học: {selectedCourse.course_name}</h3>
            {/* Các thông tin khác của khóa học có thể hiển thị tại đây */}

            <h3>Danh sách bài giảng</h3>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openLessonModal()}>
              Tạo bài giảng
            </Button>
            <Table
              dataSource={lessons}
              rowKey="id_lesson"
              style={{ marginTop: '20px' }}
              columns={[
                {
                  title: 'Tiêu đề',
                  dataIndex: 'title',
                },
                {
                  title: 'Nội dung',
                  dataIndex: 'content',
                },
                {
                  title: 'Video URL',
                  dataIndex: 'video_url',
                },
                {
                  title: 'Thứ tự',
                  dataIndex: 'order',
                },
                {
                  title: 'Hành động',
                  render: (text, record) => (
                    <>
                      <Button icon={<EditOutlined />} onClick={() => openLessonModal(record)} style={{ marginRight: 8 }}>
                        Sửa
                      </Button>
                      <Popconfirm
                        title="Bạn có chắc muốn xóa?"
                        onConfirm={() => handleDeleteLesson(record.id_lesson)}
                      >
                        <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                      </Popconfirm>
                      <Button 
                        style={{ marginLeft: 8 }} 
                        onClick={() => openDocModal(record)}
                        icon={<UploadOutlined />}
                      >
                        Tài liệu
                      </Button>
                    </>
                  ),
                },
              ]}
            />

            {/* Hiển thị danh sách document cho từng lesson */}
            {lessons.map(lesson => (
              <div key={lesson.id_lesson} style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
                <h4>Tài liệu của bài giảng: {lesson.title}</h4>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openDocModal(lesson)}>
                  Tạo tài liệu
                </Button>
                <Table
                  dataSource={documents[lesson.id_lesson] || []}
                  rowKey="id_document"
                  style={{ marginTop: '10px' }}
                  columns={[
                    {
                      title: 'Tiêu đề',
                      dataIndex: 'title',
                    },
                    {
                      title: 'Mô tả',
                      dataIndex: 'description',
                    },
                    {
                      title: 'File URL',
                      dataIndex: 'file_url',
                    },
                    {
                      title: 'Hành động',
                      render: (text, docRecord) => (
                        <>
                          <Button 
                            icon={<EditOutlined />} 
                            onClick={() => openDocModal(lesson, docRecord)} 
                            style={{ marginRight: 8 }}
                          >
                            Sửa
                          </Button>
                          <Popconfirm
                            title="Bạn có chắc muốn xóa?"
                            onConfirm={() => handleDeleteDocument(lesson.id_lesson, docRecord.id_document)}
                          >
                            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                          </Popconfirm>
                        </>
                      ),
                    },
                  ]}
                />
              </div>
            ))}
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
