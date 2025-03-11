import React from 'react';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';

const CoursesSection = ({ title, viewAllLink, courses }) => {
  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link to={viewAllLink} className="bg-blue-500 text-white px-4 py-1 rounded text-sm">
          View all
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>
    </div>
  );
};

export default CoursesSection;