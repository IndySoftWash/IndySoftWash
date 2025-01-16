const getPerCleaningCost = (price, sqft, quantity) => {
    return price * sqft * quantity
}

const getOverallCost = (price, digit) => {
    return price * digit
}

const getSumOfTotalCostYearly = (data) => {
    return data?.reduce((total, item) => {
        // Find the matching frequency based on the activePlan
        const matchedFrequency = item.frequency?.find(frequency => frequency.name === item.activePlan);
      
        if (matchedFrequency) {
            const price = matchedFrequency.price; // Extract the price from the matched frequency
            const sqft = item.sqft; // Get the sqft from the item
            const quantity = item.quantity
      
            if (sqft && price) {
                const perCleaning = getPerCleaningCost(sqft, price, quantity); // Calculate the cost for this item
                const frequencyDigit = matchedFrequency.frequencyDigit; // Extract frequencyDigit from matched frequency
                const overallAmount = getOverallCost(perCleaning, frequencyDigit); // Get the overall amount by multiplying perCleaning with frequencyDigit
        
                // Add the overallAmount to the total sum
                return total + overallAmount;
            }
        }
      
        // If no matching frequency is found or missing data, return the total as is
        return total;
    }, 0);
}



export { getPerCleaningCost, getOverallCost, getSumOfTotalCostYearly }