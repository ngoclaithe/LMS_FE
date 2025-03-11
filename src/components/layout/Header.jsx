import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAvatarClick = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

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
            {isAuthenticated && (
              <>
                <Link to="/my-course" className="text-gray-600 hover:text-blue-500 flex items-center">
                  <img src="/assets/my_course.png" alt="My course" className="h-4 w-4 mr-1" />
                  My course
                </Link>
                <Link to="/my-badge" className="text-gray-600 hover:text-blue-500 flex items-center">
                  <img src="/assets/my_badge.png" alt="My badge" className="h-4 w-4 mr-1" />
                  My badge
                </Link>
              </>
            )}
            <Link to="/leaderboard" className="text-gray-600 hover:text-blue-500 flex items-center">
              <img src="/assets/leader_board.png" alt="Leaderboard" className="h-4 w-4 mr-1" />
              Leaderboard
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={handleAvatarClick} className="flex items-center">
                  <img src="/assets/avatar.png" alt="User" className="h-8 w-8 rounded-full" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Thông tin cá nhân
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-blue-500">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Register
                </Link>
              </div>
            )}
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
