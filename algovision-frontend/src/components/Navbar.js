import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = ({ onMenuToggle, showSidebar }) => {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {showSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Thinkverse Title */}
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Thinkverse
          </h1>
        </Link>
      </div>
    </div>
  );
};

export default Navbar; 