import React from 'react';

const Sede = ({ value, onChange }) => (
  <div className="filter">
    <label>Sede</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Inserisci sede" />
  </div>
);

export default Sede;
