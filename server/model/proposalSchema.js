require('../config/dataBase')
const mongoose = require('mongoose')



const proposalSchema = new mongoose.Schema({
    uniqueid: { type: String, default: '' },
    createDate: { type: Date, default: Date.now() },
    customer: { type: String, default: '' },
    property: { type: String, default: '' },
    status: {
        type: { type: String, default: 'created' },
        date: { type: Date, default: Date.now() }
    },
    service: { type: Array, default: [] },
}, { collection : "proposalData" });

module.exports = mongoose.model('proposalData', proposalSchema);  