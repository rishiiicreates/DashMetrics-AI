import React from 'react';

const NomadicLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="relative p-1">
        {/* Logo container with crystal illustration */}
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-nomadic-crystal to-nomadic-blue flex items-center justify-center shadow-lg relative overflow-hidden">
          {/* Crystal shape in the center */}
          <div className="w-6 h-6 md:w-8 md:h-8 bg-white/90 rotate-45 transform origin-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-nomadic-blue/30 to-white/50"></div>
          </div>
          
          {/* Sparkle effects */}
          <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-75" style={{ animationDuration: '3s' }}></div>
        </div>
      </div>
      
      {/* Logo text */}
      <div className="ml-2 flex flex-col">
        <span className="text-lg md:text-xl font-bold text-nomadic-darkblue">DashMetrics</span>
        <span className="text-xs md:text-sm text-nomadic-blue opacity-80">Analytics Journey</span>
      </div>
    </div>
  );
};

export default NomadicLogo;