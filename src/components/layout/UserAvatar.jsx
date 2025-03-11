import React from 'react';

const UserAvatar = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-purple-600 flex items-center justify-center text-white font-bold overflow-hidden`}>
      A
    </div>
  );
};

export default UserAvatar;