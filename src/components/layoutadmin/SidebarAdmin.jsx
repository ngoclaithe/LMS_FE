import { Home, BookOpen, CreditCard, Users, User, List, ShoppingBag, Package, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Sidebar = () => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const menuItems = [
    // { icon: Home, label: 'Trang chủ', path: '/dashboard' },
    { icon: BookOpen, label: 'Quản lý khóa học', path: '/manage-courses' },
    { icon: CreditCard, label: 'Quản lý thanh toán', path: '/manage-payments' }, 
    { icon: Users, label: 'Quản lý sinh viên', path: '/manage-students' },
    // {
    //   icon: Store,
    //   label: 'Quản lý cửa hàng',
    //   subMenu: [
    //     { icon: List, label: 'Danh sách cửa hàng', path: '/shops' },
    //     { icon: ShoppingBag, label: 'Tạo hàng hóa mới', path: '/merchandise/create' },
    //     { icon: Package, label: 'Cập nhật hàng hóa', path: '/merchandise/update' },
    //   ]
    // },
    { icon: User, label: 'Quản lý người dùng', path: '/manage-users' }
  ];

  const handleSubMenuToggle = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index); 
  };

  return (
    <div>
      <button
        className="lg:hidden p-4 fixed top-4 left-4 z-50 bg-gray-900 text-white rounded-full"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? 'Close' : 'Open'}
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white z-10 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:w-64`}
      >
        <div className="flex flex-col h-full mt-16">
          <nav className="flex-1 px-4 py-6">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.subMenu ? (
                  <div
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors hover:bg-gray-800 text-gray-300 hover:text-white cursor-pointer"
                    onClick={() => handleSubMenuToggle(index)}
                  >
                    <item.icon size={20} />
                    <span className="font-medium whitespace-nowrap">{item.label}</span>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors hover:bg-gray-800 text-gray-300 hover:text-white"
                  >
                    <item.icon size={20} />
                    <span className="font-medium whitespace-nowrap">{item.label}</span>
                  </Link>
                )}

                {item.subMenu && openSubMenu === index && (
                  <div className="pl-8">
                    {item.subMenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.path}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors hover:bg-gray-800 text-gray-300 hover:text-white"
                      >
                        <subItem.icon size={20} />
                        <span className="font-medium whitespace-nowrap">{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
