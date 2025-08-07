import React from 'react';

const Logo = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}> 
      <img 
        src="/logo.png" 
        alt="Co-Op Tracker Logo" 
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to a modern styled div if image fails to load
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      {/* Fallback logo */}
      <div 
        className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xs hidden"
        style={{ display: 'none' }}
      >
        CT
      </div>
    </div>
  );
};

export default Logo; 