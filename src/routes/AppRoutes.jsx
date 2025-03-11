import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/Admin/DashboardPage';
import CoursePage from '../pages/Admin/CoursePage';
import CourseDetailPage from '../pages/CourseDetail';
import LoginPage from '../pages/LoginPage';
// import RegisterPage from '../pages/RegisterPage';
// import PublicCoursesPage from '../pages/PublicCoursesPage';
// import LanguageLearningPage from '../pages/LanguageLearningPage';
// import QuizzesPage from '../pages/QuizzesPage';
// import LibraryPage from '../pages/LibraryPage';
// import AboutPage from '../pages/AboutPage';
// import HelpPage from '../pages/HelpPage';
// import MyCoursesDashboard from '../pages/MyCoursesDashboard';
// import MyBadgesPage from '../pages/MyBadgesPage';
// import LeaderboardPage from '../pages/LeaderboardPage';
// import CourseDetailPage from '../pages/CourseDetailPage';
// import ProfilePage from '../pages/ProfilePage';
// import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage/>} />









      <Route path="/admin" element={<DashboardPage/>} />
      <Route path="/manage-courses" element={<CoursePage/>} />
      <Route path="/course/:id" element={<CourseDetailPage />} />


      {/* <Route path="/public-courses" element={<PublicCoursesPage />} />
      <Route path="/language-learning" element={<LanguageLearningPage />} />
      <Route path="/quizzes" element={<QuizzesPage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      

      <Route path="/course/:courseId" element={<CourseDetailPage />} />
      
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/my-course" 
        element={
          <PrivateRoute>
            <MyCoursesDashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/my-badge" 
        element={
          <PrivateRoute>
            <MyBadgesPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } 
      />
      
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} /> */}
    </Routes>
  );
};

export default AppRoutes;