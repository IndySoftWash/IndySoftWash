const extractCustomerDetail = (customer ,proposal) => {
    if (customer?.length >= 1 && proposal?.customer) {
        return customer?.find(value => value.uniqueid === proposal?.customer) || {};
    }
    return {};
};

const extractPropertyDetail = (customer, property) => {
    if (customer && property) {
    return customer?.property?.find(prop => prop.uniqueid === property) || {}
    }
    return {};
}

const mergeFrequencyArrays = (inputArray) => {
    const mergedArray = [];
    const seenNames = new Set();
  
    inputArray.forEach((obj) => {
        if (obj.frequency && Array.isArray(obj.frequency)) {
                obj.frequency.forEach((item) => {
                // Check if the name has already been added
                if (!seenNames.has(item.name)) {
                    seenNames.add(item.name);
                    mergedArray.push({ ...item, services: [] }); // Add a `source` field to hold the matching objects
                }
            });
        }
    });
  
    // Match and add the source object where `activePlan` matches `name`
    inputArray.forEach((obj) => {
        mergedArray.forEach((mergedItem) => {
            if (obj.activePlan === mergedItem.name) {
                mergedItem.services?.push(obj); // Add the entire object to the `source` field
            }
        });
    });

    return mergedArray;
};

export { extractCustomerDetail, extractPropertyDetail, mergeFrequencyArrays }