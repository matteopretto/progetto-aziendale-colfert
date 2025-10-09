import React from 'react';

const Mese = ({ value, onChange }) => (
 <div>
    <label className="text-gray-700 text-sm font-medium mr-3">MESE</label>
    <input
      type="number"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Inserisci mese"
      min="1"
      max="12"
      className="p-2 border w-1/2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-150"
    />
  </div>
);

export default Mese;
