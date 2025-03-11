import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import UserAvatar from '../layout/UserAvatar';

const Header = () => {
  return (
    <header className="bg-white py-4 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">

          <Link to="/" className="flex items-center">
            <img src="/assets/logo.png" alt="Logo" className="h-8 w-auto" />
          </Link>

          <div className="relative w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for anything you want"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/my-course" className="text-gray-600 hover:text-blue-500 flex items-center">
              <img src="/assets/my_course.png" alt="My course" className="h-4 w-4 mr-1" />
              My course
            </Link>
            <Link to="/my-badge" className="text-gray-600 hover:text-blue-500 flex items-center">
              <img src="/assets/my_badge.png" alt="My badge" className="h-4 w-4 mr-1" />
              My badge
            </Link>
            <Link to="/leaderboard" className="text-gray-600 hover:text-blue-500 flex items-center">
              <img src="/assets/leader_board.png" alt="Leaderboard" className="h-4 w-4 mr-1" />
              Leaderboard
            </Link>
            <UserAvatar />
          </div>
        </div>

        <nav className="mt-4">
          <ul className="flex space-x-8">
            <li>
              <Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link>
            </li>
            <li>
              <Link to="/public-courses" className="text-gray-600 hover:text-blue-500">Public Courses</Link>
            </li>
            <li>
              <Link to="/language-learning" className="text-gray-600 hover:text-blue-500">Language Learning</Link>
            </li>
            <li>
              <Link to="/quizzes" className="text-gray-600 hover:text-blue-500">Quizzes</Link>
            </li>
            <li>
              <Link to="/library" className="text-gray-600 hover:text-blue-500">Library</Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-600 hover:text-blue-500">About</Link>
            </li>
            <li>
              <Link to="/help" className="text-gray-600 hover:text-blue-500">Help</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
