import React from 'react';

function Dadata({ value, onChange }) {
  return (
    <div>
      <label className="text-gray-700 text-sm font-medium mr-2">DA:</label>
      <input
        type="date"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
      />
    </div>
  );
}


export default Dadata;
