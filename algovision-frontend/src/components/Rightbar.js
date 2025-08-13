import React from 'react';
import { Phone } from 'lucide-react';

const Rightbar = () => {
  return (
    <div className="w-80 h-screen bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto sticky top-0">
      {/* Conference Call Button */}
      <div className="mb-6">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
          <Phone size={20} />
          <span>Start Conference</span>
        </button>
      </div>
    </div>
  );
};

export default Rightbar; 