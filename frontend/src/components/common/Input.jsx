import React from 'react'

function Input({ name, type, label, value, error, onChange }) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        id={name}
        onChange={onChange}
        value={value}
        name={name}
        type={type}
        className="form-control"
      />
      { error && <div className="alert alert-danger">{error}</div> }
    </div>
  );
}

export default Input