const frequencyDigitConverter = {
    'one-off': 1,
    'quarterly': 4,
    'bi-quarterly': 8,
    'annual': 1,
    'bi-annual': 2,
    'bi-weekly': 26,
    'monthly': 12,
}
const frequencyDigit = [
    'one-off',
    'quarterly',
    'bi-quarterly',
    'annual',
    'bi-annual',
    'bi-weekly',
    'monthly',
]

const short_list_month = {
    'January' : 'Jan',
    'February' : 'Feb',
    'March' : 'March',
    'April' : 'April',
    'May' : 'May',
    'June' : 'June',
    'July' : 'July', 
    'August' : 'Aug',
    'September' : 'Sept',
    'October' : 'Oct',
    'November' : 'Nov',
    'December' : 'Dec'
}

export {frequencyDigitConverter, frequencyDigit, short_list_month}