const formatNumberInput = (e) => {
  const value = e.target.value;

  if (value && parseFloat(value) < 0.10 && value && parseFloat(value) !== 0) {
    // If the value is smaller than 0.10, set it to 0.10
    e.target.value = 0.10;
  } else if (value && !value.includes(".")) {
    // For integers, format without decimals
    e.target.value = parseFloat(value).toFixed(0);
  } else if (value) {
    // Ensure proper formatting for decimals
    e.target.value = parseFloat(value);
  }
};


export {formatNumberInput}