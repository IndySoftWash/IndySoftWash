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

const getTotalSqft = (service) => {
    if (Array.isArray(service)) {
        // Calculate totalSqft by summing up the sqft values multiplied by their quantities
        const totalSqft = service.reduce(
            (acc, curr) => {
                const matchingFrequency = curr.frequency.find(freq => freq.name === curr.activePlan);
                const frequencyMultiplier = matchingFrequency ? matchingFrequency.frequencyDigit : 1; // Default to 1 if no match
                return acc + (parseFloat(curr.sqft) * (parseFloat(curr.quantity) || 1) * frequencyMultiplier);
            },
            0 // Initialize the accumulator as 0
        );
        return totalSqft;
    }
}



export { getPerCleaningCost, getOverallCost, getSumOfTotalCostYearly, getTotalSqft }