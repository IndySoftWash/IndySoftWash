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

export { extractCustomerDetail, extractPropertyDetail }