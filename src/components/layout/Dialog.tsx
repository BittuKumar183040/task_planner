import { Notebook, X } from 'lucide-react'
import React, { useState } from 'react'

const Dialog = ({ children, Logo, title, onClose, closeable=true, className }: { children: React.ReactNode; Logo?: React.ReactNode; title: React.ReactNode; closeable?: boolean; onClose: () => void; className?: string }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 150);
  };

  return (
    <div
      className={` mt-12 fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-md transition-opacity duration-150
        ${isClosing ? "opacity-0" : "opacity-100"} ${className}`}
      onClick={handleClose}
    >
      <div
        className={`max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-150
          ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center text-sm font-medium text-gray-900">
            {Logo ?? <Notebook size={18} className="mr-2" />}
            {title}
          </div>
          {closeable &&
            <button onClick={handleClose} className="text-gray-500 transition hover:text-gray-700">
              <X size={20} />
            </button>
          }
        </div>

        <div className="max-h-[calc(90vh-65px)] overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
export default Dialog