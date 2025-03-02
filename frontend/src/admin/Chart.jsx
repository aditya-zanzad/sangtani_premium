import React from 'react';
const Chart = ({ title, chartId, children }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold">{title}</h4>
          <button className="text-gray-600 text-lg p-2 rounded-lg hover:bg-gray-200 transition">
            <i className="mdi mdi-dots-vertical"></i>
          </button>
        </div>
        <div id={chartId} className="morris-chart" style={{ height: '300px' }}>
          {children}
        </div>
      </div>
    </div>
  );
  
  export default Chart;
  