import React from 'react';
const StatsCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition">
      <div className="p-5 flex items-center justify-between">
        <div>
          <span className="text-gray-600 font-semibold">{title}</span>
          <span className="text-2xl font-semibold">{value}</span>
        </div>
        <div className={`${color} text-white rounded-full p-3 flex justify-center items-center`}>
          <i className={`uil ${icon} text-3xl`}></i>
        </div>
      </div>
      <div className="px-5 py-4 bg-gray-50 rounded-b-lg">
        <a href="#!" className="text-blue-600 hover:underline">View data <i className="uil uil-arrow-right"></i></a>
      </div>
    </div>
  );
  
  export default StatsCard;
  