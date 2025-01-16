const route = require('express').Router();
const customerModel = require('../model/customerSchema')
const proposalModel = require('../model/proposalSchema')
const serviceModel = require('../model/serviceSchema')
require('dotenv').config()
const nodemailer = require('nodemailer')

route.get('/', async(req, res) => {
    const customer = await customerModel.find({})
    res.send({ success: true, result: customer })
})

route.post('/', async (req, res) => {
    const customerDetail = req.body;
    const { email } = customerDetail?.personalDetails;

    if (!email) {
        return res.status(400).send({ success: false, message: 'Email is required.' });
    }

    try {
        // Create customer in database
        const newCustomer = await customerModel.create(customerDetail);

        // Nodemailer transporter setup
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.BREVO_SMTP_MAIL,
                pass: process.env.BREVO_SMTP_API_KEY
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // Email content
        const htmlContent = `
            <p>We are delighted to welcome you to Indy Soft Wash!</p>
            <p>Your account has been successfully created, and you are now part of our valued community.</p>
        `;

        // Send email
        await transporter.sendMail({
            from: `<${process.env.BREVO_SENDER_MAIL}>`,
            to: email,
            subject: `Greetings from Indy Soft Wash! 🎉`,
            html: htmlContent,
        });

        // Send success response
        res.status(200).send({ result: newCustomer, success: true, message: 'Customer created and email sent successfully.' });
    } catch (error) {
        console.error("Error creating customer or sending email: ", error);
        res.status(500).send({ success: false, message: 'An error occurred while creating customer or sending email.' });
    }
});

route.post('/property', async (req, res) => {
    try {
        const data = req.body;
        const {
            customerid,
            uniqueid,
            propertyName,
            property,
            buildings,
            units,
            billingAddress,
            propertyFeatures,
            serviceAddress,
            propertyType,
            note
        } = data;

        // Ensure required fields are present
        if (!customerid || !uniqueid || !propertyName || !property) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const propertyData = {
            uniqueid,
            propertyName,
            property,
            billingAddress,
            serviceAddress,
            note,
            buildings,
            units,
            propertyType,
            propertyFeatures,
        };

        // Add the property to the customer record
        const result = await customerModel.updateOne(
            { uniqueid: customerid },
            { $push: { property: propertyData } }
        );

        return res.status(200).send({ message: 'Property added successfully', success: true });
    } catch (error) {
        console.error('Error adding property:', error);
        return res.status(500).send({ error: 'Internal server error', success: false });
    }
});

route.put('/', async (req, res) => {
    try {
        const { uniqueid, ...updateFields } = req.body; // Extract 'uniqueid' and other fields

        // console.log(req.body)
    
        if (!uniqueid) {
            return res.status(400).send({ message: "uniqueid is required" });
        }
    
        // Perform the update
        const result = await customerModel.updateMany(
            { uniqueid }, 
            { $set: updateFields }
        );
    
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "No records found to update" });
        }
    
        // Retrieve updated documents
        const updatedData = await customerModel.find({ uniqueid });
    
        res.status(200).send({ message: "Update successful", result: updatedData[0], success: true });
        } catch (error) {
        console.error("Update error:", error);
        res.status(500).send({ message: "Internal server error" });
        }
  });
  

route.delete('/:id', async (req, res) => {
    const customerid = req.params.id;

    try {
        const getCustomerData = await customerModel.findOne({ uniqueid: customerid });

        if (!getCustomerData) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        const allProposals = [];
        const allServices = [];

        getCustomerData.property.forEach((property) => {
            if (property.proposal) {
                allProposals.push(...property.proposal); // Collect all proposal unique IDs
            }
            if (property.services) {
                allServices.push(...property.services); // Collect all service unique IDs
            }
        });

        if (allProposals.length > 0) {
            await proposalModel.deleteMany({ uniqueid: { $in: allProposals } });
        }

        if (allServices.length > 0) {
            await serviceModel.deleteMany({ uniqueid: { $in: allServices } });
        }

        await customerModel.deleteOne({ uniqueid: customerid });

        // Success response
        res.status(200).send({ message: 'Customer and all related proposals and services have been deleted successfully.', success: true });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'An error occurred while deleting the customer and associated data.', error: error.message });
    }
});


module.exports = route