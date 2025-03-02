import React from 'react';
const Header = () => (
    <header className="bg-white shadow-md px-5 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <a className="logo-box" href="/taildash/">
          <img src="assets/images/logo-sm.png" className="h-10" alt="Logo" />
        </a>
        <h4 className="text-gray-900 text-xl font-semibold">Dashboard</h4>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
        <span className="text-sm">Profile</span>
      </button>
    </header>
  );
  
  export default Header;
  