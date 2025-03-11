import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, getUserInfo } from '../services/apiAuth';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo_admin.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      const role = sessionStorage.getItem('role');
      if (role === 'admin' || role === 'teacher') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await loginUser(formData.email, formData.password);
      const userInfo = await getUserInfo(response.token);
      
      login(response.token, userInfo.role, userInfo.email);
      
      if (userInfo.role === 'admin' || userInfo.role === 'teacher') {
        navigate('/admin');
      } else if (userInfo.role === 'student') {
        navigate('/');
      } else {
        setError('Bạn không có quyền truy cập trang này.');
      }
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      <div className="absolute top-4 left-4">
        <Link to="/">
          <img src={logo} alt="Logo Admin" className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
        </Link>
      </div>

      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">

          <div className="flex justify-center">
            <img src="/assets/login.png" alt="Login Banner" className="h-20 w-auto" />
          </div>
          <div>
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Đăng nhập
            </h2>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-center text-sm font-medium bg-red-50 p-2 rounded-md">
                {error} 
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Nhập email vào đây lẹ lên"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Mật khẩu</label>
                <input
                  id="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Điền nốt mật khẩu vào đi"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;