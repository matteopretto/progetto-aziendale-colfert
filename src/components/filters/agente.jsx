import React from 'react';

const Agente = ({ value, onChange }) => (
  <div className="filter">
    <label>Agente</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Inserisci agente" />
  </div>
);

export default Agente;
