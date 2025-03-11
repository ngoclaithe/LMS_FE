import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Banner from '../components/layout/Banner';
import CoursesSection from '../components/layout/CoursesSection';
import { get5CourseByCourseType } from '../services/apiCourse';

const HomePage = () => {
  const [publicCourses, setPublicCourses] = useState([]);
  const [outlineCourses, setOutlineCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const publicCoursesData = await get5CourseByCourseType('public');
        setPublicCourses(publicCoursesData);
        
        const outlineCoursesData = await get5CourseByCourseType('outline');
        setOutlineCourses(outlineCoursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Banner />
        
        {loading ? (
          <div className="text-center py-8">
            <p>Loading courses...</p>
          </div>
        ) : (
          <>
            <CoursesSection 
              title="Public Courses" 
              viewAllLink="/public-courses" 
              courses={publicCourses} 
            />
            
            <CoursesSection 
              title="Outline Courses" 
              viewAllLink="/outline-courses" 
              courses={outlineCourses} 
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;