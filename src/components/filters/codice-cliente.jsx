import React from 'react';

const CodiceCliente = ({ value, onChange }) => (
  <div className="filter">
    <label>Codice Cliente</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Inserisci codice cliente" />
  </div>
);

export default CodiceCliente;
