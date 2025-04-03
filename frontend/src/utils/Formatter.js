const formatNumberInput = (e) => {
  const value = e.target.value;
  // console.log(value)

  if (value && parseFloat(value) < 0.01 && value && parseFloat(value) !== 0) {
    // If the value is smaller than 0.01, set it to 0.01
    e.target.value = 0.01;
  } else if (value && !value.includes(".")) {
    // For integers, format without decimals
    e.target.value = parseFloat(value).toFixed(0);
  } else if (value) {
    // Ensure proper formatting for decimals
    e.target.value = parseFloat(value);
  }
};

export const formatNumberThousand = (e) => {
  const value = e.target.value;
  // console.log(value);

  // If the value is not empty and exceeds 1000, set it to 1000
  if (value && parseFloat(value) >= 1000) {
    e.target.value = 1000;
  } else if (value && parseFloat(value) < 1001 && value && parseFloat(value) !== 0) {
    // If the value is smaller than 0.01, set it to 0.01
    e.target.value = 1;
  } else if (value && !value.includes(".")) {
    // For integers, format without decimals
    e.target.value = parseFloat(value).toFixed(0);
  } else if (value) {
    // Ensure proper formatting for decimals
    e.target.value = parseFloat(value);
  }
};



export {formatNumberInput}