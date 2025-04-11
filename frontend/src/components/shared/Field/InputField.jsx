import React, { useState } from "react";
import "./InputWithLabel.css"; // Import the CSS for styling
import { useRef } from "react";

const InputWithLabel = ({ label, type = "text", name, setSelection, index, value, onChange, required, className, onBlur }) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef()

    const handleFocus = () => {
        setIsFocused(true);
        inputRef.current.focus()
    };

    const handleBlur = (e) => {
        
        if (e.target.value === "") {
        setIsFocused(false);
        } else {
            onBlur && setSelection(index, name, onBlur(e));
        }

    };

  return (
    <div className="input-container">
        <div className={`input-wrapper ${isFocused || value ? "focused" : ""}`}>
            <label htmlFor={name} onClick={handleFocus} className="input-label">
                {label}
            </label>
            <input
                ref={inputRef}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                id={name}
                onFocus={handleFocus}
                onBlur={(e) => {handleBlur(e)}}
                className={`input-field ${className}`}  
            />
        </div>
    </div>
  );
};

export default InputWithLabel;
