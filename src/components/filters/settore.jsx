import React from 'react';

const Settore = ({ value, onChange }) => (
  <div className="filter">
    <label>Settore</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Inserisci settore" />
  </div>
);

export default Settore;
