import React from 'react';

const Iban = ({ value, onChange }) => (
  <div className="filter">
    <label>IBAN</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Inserisci IBAN" />
  </div>
);

export default Iban;
