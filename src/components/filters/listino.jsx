import React from 'react';

const Listino = ({ value, onChange }) => (
  <div className="filter">
    <label>Listino</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Inserisci listino" />
  </div>
);

export default Listino;
