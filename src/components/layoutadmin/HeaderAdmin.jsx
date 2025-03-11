import React, { useState, useEffect } from 'react';
import { Bell, Menu, LogOut, MessageCircle, AlertCircle } from 'lucide-react';
import logo from '../../assets/logo_admin.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ toggleSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: '', role: '' });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const role = sessionStorage.getItem('role');
    setUserInfo({ email, role });

    const eventSource = new EventSource('https://giaongay.cloud/sse/stream');
    eventSource.onmessage = (event) => {
      const newNotification = event.data;
      setNotifications(prev => [...prev, newNotification]);
      setUnreadCount(prev => prev + 1);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleChatClick = () => {
    navigate('/customer-chat');
    setShowProfileMenu(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(prev => !prev);
    setShowProfileMenu(false);
    setUnreadCount(0);
  };

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="ml-4 flex items-center flex-shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-12 rounded md:h-16 md:w-16"
            />
            <span className="text-lg md:text-2xl font-bold text-red-500 ml-2 md:ml-4">
              Học viện Ngân Hàng
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="p-2 rounded-lg hover:bg-gray-100 relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 max-h-80 overflow-y-auto">
                <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                  Thông báo mới
                </div>
                {notifications.map((message, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    {message}
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="px-4 py-2 text-sm text-gray-400">Không có thông báo mới</div>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">{userInfo.email}</p>
                <p className="text-xs text-gray-500">{userInfo.role}</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2">
                {userInfo.role === 'admin' && (
                  <>
                    <button
                      onClick={handleChatClick}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <MessageCircle size={16} className="mr-2" />
                      Chat với người dùng
                    </button>
                    <button
                      onClick={handleNotificationClick}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <AlertCircle size={16} className="mr-2" />
                      Thông báo
                    </button>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};