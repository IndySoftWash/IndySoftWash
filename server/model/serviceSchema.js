require('../config/dataBase')
const mongoose = require('mongoose')

const workOrderSchema = new mongoose.Schema({
    createDate: { type: Date, default: Date.now() },
    updateDate: { type: Date, default: Date.now() },
    status: { type: String, default: 'pending' },
    name: { type: String, default: '' },
    workOrder: { type: String, default: '' },
    description: { type: String, default: '' },
    serviceAddress: { type: String, default: '' },
    instruction: { type: String, default: '' },
    assign: { type: String, default: '' },
    checkList: { type: Array, default: [] },
    images: [{
        uniqueid: { type: String, default: '' },
        s3Url: { type: String, default: '' },
        s3Key: { type: String, default: '' },
    }],
    timing: {
        startDate: { type: Date, default: Date.now() },
        endDate: { type: Date, default: Date.now() },
    }
})

const serviceSchema = new mongoose.Schema({
    uniqueid: { type: String, default: '' },
    createDate: { type: Date, default: Date.now() },
    name: { type: String, default: '' },
    type: { type: String, default: '' },
    customer: { type: String, default: '' },
    proposal: { type: String, default: '' },
    property: { type: String, default: '' },
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
    }],
    workOrder: workOrderSchema
}, { collection : "serviceData" });

module.exports = mongoose.model('serviceData', serviceSchema);  