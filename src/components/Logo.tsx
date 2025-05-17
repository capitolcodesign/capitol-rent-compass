
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  // Size mappings
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
  };
  
  return (
    <div className={`flex items-center ${sizes[size]}`}>
      <img 
        src="/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png"
        alt="CAPITOL codesign Logo" 
        className={`${sizes[size]} object-contain`}
      />
    </div>
  );
};

export default Logo;
