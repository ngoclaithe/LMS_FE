import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const CourseCard = ({ id_course, course_name, start_date, end_date, avatar }) => {
  const formattedStartDate = format(new Date(start_date), 'dd/MM/yyyy');
  const formattedEndDate = format(new Date(end_date), 'dd/MM/yyyy');
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img 
          src={avatar || '/default-course-image.jpg'} 
          alt={course_name} 
          className="w-full h-32 object-cover" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-course-image.jpg';
          }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg line-clamp-2 h-14">{course_name}</h3>
        
        <div className="mt-2 text-sm text-gray-600">
          <p>Start: {formattedStartDate}</p>
          <p>End: {formattedEndDate}</p>
        </div>
        
        <div className="mt-4 text-center">
          <Link 
            to={`/course/${id_course}`} 
            className="bg-blue-500 text-white text-sm py-1 px-4 rounded hover:bg-blue-600"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;