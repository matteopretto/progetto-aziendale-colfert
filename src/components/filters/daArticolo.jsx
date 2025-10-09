import React from 'react';

const DaArticolo = ({ value, onChange }) => (
  <div className="filter">
    <label>Da Articolo</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Inserisci da articolo" />
  </div>
);

export default DaArticolo;
