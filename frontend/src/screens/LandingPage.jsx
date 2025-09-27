import React from 'react';
import config from '../constants.js';

const LandingPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center font-sans">
      <div className="text-center p-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
          Welcome to <span className="text-indigo-600">MonkeyLog</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Discover, track, and share monkey sightings from around the world. Built entirely on the Manifest platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={() => onLogin('user@manifest.build', 'password')}
            className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
          >
            Try Demo
          </button>
          <a 
            href={`${config.BACKEND_URL}/admin`} 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
          >
            Admin Panel
          </a>
        </div>
        <p className="text-sm text-gray-500 mt-6">Default demo credentials: user@manifest.build / password</p>
      </div>
    </div>
  );
};

export default LandingPage;
