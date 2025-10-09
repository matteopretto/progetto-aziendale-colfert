import React from 'react';

const Articolo = ({ value, onChange }) => (
  <div className="filter">
    <label>Articolo</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Inserisci articolo" />
  </div>
);

export default Articolo;
