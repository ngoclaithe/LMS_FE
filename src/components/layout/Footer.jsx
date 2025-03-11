import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaYoutube, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-500 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-xl font-bold mb-4">HỌC VIỆN NGÂN HÀNG</h3>
            <p className="mb-4">
            Mục tiêu chính của HVNH là đào tạo nguồn nhân lực chất lượng cao cho ngành Tài chính – Ngân hàng, Với định hướng đào tạo mang tính ứng dụng cao, người học sau khi tốt nghiệp có đủ năng lực để đảm nhận được được các công việc tại các tổ chức liên quan
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">LIÊN KẾT</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:underline">Tiếp cận hàng ngày</Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">Công việc trống sẵn</Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">Chính sách bảo mật</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">LIÊN HỆ</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span>12 P Chùa Bộc, Quang Trung, Đống Đa, Hà Nội</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2" />
                <span>Điện thoại: 1900 561 595</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2" />
                <span>Email: truyenthong@hvnh.edu.vn</span>
              </li>
            </ul>

            <div className="mt-4">
              <form className="flex">
                <input
                  type="email"
                  placeholder="Email"
                  className="py-2 px-3 text-black rounded-l focus:outline-none"
                />
                <button className="bg-red-500 text-white py-2 px-4 rounded-r">
                  Submit
                </button>
              </form>
            </div>

            <div className="mt-4 flex space-x-2">
              <a href="#" className="bg-red-500 p-2 rounded-full">
                <FaYoutube />
              </a>
              <a href="#" className="bg-blue-700 p-2 rounded-full">
                <FaFacebookF />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-blue-400 text-center">
          <p>UITNB Designed by Group 1</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;