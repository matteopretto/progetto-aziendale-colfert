import React from 'react';

const Classecliente = ({ value, onChange }) => (
  <div className="filter">
    <label>Classe Cliente</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Inserisci classe cliente" />
  </div>
);

export default Classecliente;
