import { useState } from 'react';

const ToggleButton = ({ toggle, index }) => {
  const [activeButton, setActiveButton] = useState('auto'); // Default to 'auto' mode

  const handleToggle = (button) => {
    setActiveButton(button);
    toggle(button, index)
  };

  return (
    <div className="toggle-container">
      <button
      type='button'
        className={`toggle-btn auto ${activeButton === 'auto' ? 'active' : ''}`}
        onClick={() => {handleToggle('auto')}}
      >
        Auto
      </button>
      <button
      type='button'
        className={`toggle-btn manual ${activeButton === 'manual' ? 'active' : ''}`}
        onClick={() => {handleToggle('manual')}}
      >
        Manual
      </button>
    </div>
  );
};

export default ToggleButton;
