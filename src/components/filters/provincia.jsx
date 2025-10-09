import React from 'react';

const Provincia = ({ value, onChange }) => (
  <div className="filter">
    <label>Provincia</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Inserisci provincia" />
  </div>
);

export default Provincia;
