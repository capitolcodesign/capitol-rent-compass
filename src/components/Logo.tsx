
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  // Size mappings
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-16',
  };
  
  return (
    <div className={`flex items-center ${sizes[size]}`}>
      <img 
        src="/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png"
        alt="SHRA Logo" 
        className={`${sizes[size]} object-contain mr-3`}
      />
      <div className="flex flex-col">
        <span className="font-bold text-element-navy leading-tight">SHRA</span>
        <span className="text-xs text-element-charcoal/70 leading-tight">Rent Reasonableness</span>
      </div>
    </div>
  );
};

export default Logo;
