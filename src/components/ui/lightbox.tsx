
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface LightboxProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Lightbox({ 
  src, 
  alt = "Image", 
  width = 512, 
  height = 512, 
  className = "" 
}: LightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height} 
        className={`cursor-pointer object-cover ${className}`}
        onClick={() => setIsOpen(true)}
        style={{ width, height }}
      />
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-auto p-0 border-none bg-transparent">
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 focus:outline-none"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center justify-center h-full">
            <img 
              src={src} 
              alt={alt} 
              className="max-w-[85vw] max-h-[85vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
