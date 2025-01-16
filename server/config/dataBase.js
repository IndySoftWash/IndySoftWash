const mongoose = require("mongoose")
require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/Indy-wash`);


mongoose.connection.on("connected", ()=>{
    console.log("Database connected...")
})
mongoose.connection.on("error", (err)=>{
    console.log(err)
})



module.exports = mongoose;