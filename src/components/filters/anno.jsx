import React from "react";

const Anno = ({ value, onChange }) => (
  <div>
    <label className="text-gray-700 text-sm font-medium mr-3">ANNO</label>
    <input
      type="number"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Inserisci anno"
      min="2000"
      max="2100"
      className="p-2 border w-1/2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-150"
    />
  </div>
);

export default Anno;
