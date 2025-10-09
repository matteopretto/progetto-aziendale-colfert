import React from 'react';

const AdArticolo = ({ value, onChange }) => (
  <div className="filter">
    <label>Ad Articolo</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Inserisci ad articolo" />
  </div>
);

export default AdArticolo;
