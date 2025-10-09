import React from 'react';

const Utente = ({ value, onChange }) => (
  <div className="filter">
    <label>Utente</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Inserisci utente" />
  </div>
);

export default Utente;
