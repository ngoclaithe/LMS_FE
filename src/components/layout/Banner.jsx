import React from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from '../layout/UserAvatar';

const Banner = () => {
  return (
    <div className="bg-white-100 rounded-lg overflow-hidden p-6">
      <div className="flex">
        <div className="w-[70%] mr-4 relative">
          <img
            src="/assets/tiengnhatcoban.png"
            alt="Tiếng Nhật Cơ bản"
            className="w-full object-contain"
          />
          <div className="absolute top-4 left-4 bg-yellow-300 px-3 py-1 inline-block">
            <div className="flex items-center">
              <span className="font-bold text-lg mr-1">Learn to earn 30</span>
              <img src="/assets/star.png" alt="Star" className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="w-[30%] bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-center font-bold mb-2">Top Learners</h3>
          <div className="flex justify-center space-x-2 mb-4">
            <UserAvatar />
            <UserAvatar />
            <UserAvatar />
            <UserAvatar />
          </div>
          
          <h3 className="text-center font-bold mb-2">Your Best Rank</h3>
          <div className="flex justify-center space-x-2 mb-4">
            <UserAvatar />
            <UserAvatar />
            <UserAvatar />
            <UserAvatar />
          </div>

          <div className="text-center">
            <h3 className="font-bold">My Certificate</h3>
            <div className="flex justify-center my-2">
              <img src="/assets/star.png" alt="Star" className="w-5 h-5" />
            </div>
            
            <h3 className="font-bold">My Star</h3>
            
            <div className="bg-gray-100 rounded-full p-3 mt-2 text-center">
              <div className="font-bold text-2xl">0/10</div>
              <div className="text-xs text-gray-500">Đạt mục tiêu để nhận thưởng</div>
            </div>

            <div className="mt-4">
              <div className="font-bold text-center">0</div>
              <div className="text-xs text-gray-500 text-center">Courses completed</div>
              <button className="bg-blue-500 text-white py-1 px-4 rounded mt-2">Learn Now</button>
            </div>

            <div className="mt-4">
              <div className="font-bold text-center">1</div>
              <div className="text-xs text-gray-500 text-center">Current Courses</div>
              <button className="bg-blue-500 text-white py-1 px-4 rounded mt-2">Start</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
