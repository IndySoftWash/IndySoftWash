import React, { useState } from "react";
import "./SelectWithLabel.css"; // Import the CSS for styling

const SelectWithLabel = ({ label, options, name, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    if (!e.target.value) {
      setIsFocused(false);
    }
  };

  // console.log(value )

  return (
    <div className="select-container">
      <div className={`select-wrapper ${isFocused || value ? "focused" : ""}`}>
        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="select-field"
        >
          <option value="" disabled hidden>
            {label}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <label htmlFor={name} className="select-label">
          {label}
        </label>
      </div>
    </div>
  );
};

export default SelectWithLabel;
