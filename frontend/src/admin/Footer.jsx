import React from 'react';
const Footer = () => (
    <footer className="bg-white shadow-md h-16 flex items-center justify-between px-6 mt-auto">
      <p className="text-sm font-medium text-gray-600">{new Date().getFullYear()} © TailDash</p>
      <p className="text-sm font-medium text-gray-600">
        Design &amp; Develop by <a href="#" className="text-blue-600 hover:underline">MyraStudio</a>
      </p>
    </footer>
  );
  
  export default Footer;
  