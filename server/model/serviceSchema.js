require('../config/dataBase')
const mongoose = require('mongoose')



const serviceSchema = new mongoose.Schema({
    uniqueid: { type: String, default: '' },
    createDate: { type: Date, default: Date.now() },
    name: { type: String, default: '' },
    type: { type: String, default: '' },
    quantity: { type: Number, default: 0 },
    sqft: { type: Number, default: 0 },
    description: { type: String, default: '' }, 
    activePlan: { type: String, default: '' }, 
    frequency: [{
        name: { type: String, default: '' },
        price: { type: Number, default: 0 },
        frequencyDigit: { type: Number, default: 0 },
    }],
    months: { type: Array, default: [] },
    images: [{
        uniqueid: { type: String, default: '' },
        s3Url: { type: String, default: '' },
        s3Key: { type: String, default: '' },
    }]
}, { collection : "serviceData" });

module.exports = mongoose.model('serviceData', serviceSchema);  