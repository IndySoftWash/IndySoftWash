require('../config/dataBase')
const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({

    uniqueid: { type: String, default: '' },
    propertyName: { type: String, default: '' },
    property: { type: String, default: '' },
    billingAddress: { type: String, default: '' },
    serviceAddress: { type: String, default: '' },
    note: { type: String, default: '' },
    buildings: { type: Number, default: 0 },
    units: { type: Number, default: 0 },
    propertyType: { type: Array, default: [] },
    propertyFeatures: { type: Array, default: [] },
    proposal: { type: Array, default: [] },
    services: { type: Array, default: [] },

})

const customerSchema = new mongoose.Schema({

uniqueid: { type: String, default: '' },
createDate: { type: Date, default: Date.now() },
customerType: { type: String, default: '' },
contactMethod: { type: String, default: '' },
personalDetails: {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: Number, default: 0 },
    company: { type: String, default: '' },
    status: { type: String, default: '' },
},
property: [propertySchema],
additionalContact: {
    detail1: {
        fullname: { type: String, default: '' },
        title: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: Number, default: 0 },
    },
    detail2: {
        fullname: { type: String, default: '' },
        title: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: Number, default: 0 },
    }
},
additionalNotes: { type: String, default: '' },

}, { collection : "customerData" });

module.exports = mongoose.model('customerData', customerSchema);  