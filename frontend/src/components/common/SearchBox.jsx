import React from 'react'

function SearchBox({value, onChange}) {
  return (
    <div className="input-group mb-3">
      <input
        type="text"
        value={value}
        className="form-control"
        placeholder="Search..."
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBox