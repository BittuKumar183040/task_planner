import { Notebook, X } from 'lucide-react'
import React from 'react'

const Dialog = ({ children, Logo, title, onClose }: { children: React.ReactNode; Logo?: React.ReactNode; title: React.ReactNode; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-md">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center text-sm font-medium text-gray-900">
            {Logo ?? <Notebook size={18} className="mr-2" />}
            {title}
          </div>
          <button onClick={onClose} className="text-gray-500 transition hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(90vh-65px)] overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog