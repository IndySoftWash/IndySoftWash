const route = require('express').Router();
const customerModel = require('../model/customerSchema')
const proposalModel = require('../model/proposalSchema')
const serviceModel = require('../model/serviceSchema')
require('dotenv').config()
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid');
const multerS3 = require('multer-s3');
const multer = require('multer');
const fs = require('fs')
const path = require('path')
const { deleteImageFromS3, s3Client } = require('../utils/aws')



// Multer S3 storage configuration
const storage = multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    // acl: 'public-read',
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        const newFilename = `customer/${uniqueSuffix}${extension}`;
        cb(null, newFilename); // S3 key (path within the bucket)
    },
});

// Multer instance with limits and file type filter
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 * 1024 }, // Limit to 10MB
    fileFilter: (req, file, cb) => {
        cb(null, true);
    },
});


route.get('/', async(req, res) => {
    const customer = await customerModel.find({})
    res.send({ success: true, result: customer })
})

route.post('/', upload.array('images', 5), async (req, res) => {
    const customerDetail = JSON.parse(req.body.customerData); // Assuming customer data is sent as JSON string
    const { email } = customerDetail?.personalDetails;

    if (!email) {
        return res.status(400).send({ success: false, message: 'Email is required.' });
    }

    try {
        // Add uploaded image information to customer details
        if (req.files && req.files.length > 0) {
            customerDetail.images = req.files.map(file => ({
                uniqueid: uuidv4(),
                s3Url: file.location,
                s3Key: file.key
            }));
        }

        // Check if email already exists
        const existingCustomer = await customerModel.findOne({
            'personalDetails.email': email
        });

        if (existingCustomer) {
            return res.status(400).send({ 
                success: false, 
                message: 'A customer with this email already exists.' 
            });
        }

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
        res.status(200).send({ 
            result: newCustomer, 
            success: true, 
            message: 'Customer created and email sent successfully.'
        });
    } catch (error) {
        console.error("Error creating customer or sending email: ", error);
        res.status(500).send({ 
            success: false, 
            message: 'An error occurred while creating customer or sending email.' 
        });
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

route.put('/', upload.array('images', 5), async (req, res) => {
    try {
        const removedImages = JSON.parse(req.body.removedImages);
        const updateFields = JSON.parse(req.body.customerData);
        const { uniqueid } = updateFields;

        if (!uniqueid) {
            return res.status(400).send({ message: "uniqueid is required" });
        }
        console.log(removedImages);

        let updateQuery = {};

        // Handle removed images
        if (removedImages && removedImages.length > 0) {
            updateQuery.$pull = { images: { uniqueid: { $in: removedImages } } };

            // Delete each image from S3
            const existingCustomer = await customerModel.findOne({ uniqueid });
            if (existingCustomer) {
                for (const imageId of removedImages) {
                    const imageToDelete = existingCustomer.images.find(img => img.uniqueid === imageId);
                    if (imageToDelete) {
                        await deleteImageFromS3(imageToDelete.s3Key);
                    }
                }
            }
        }

        // Handle new images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                uniqueid: uuidv4(),
                s3Url: file.location,
                s3Key: file.key
            }));

            updateQuery.$push = { images: { $each: newImages } };
        }

        // Include other fields to update
        for (const key in updateFields) {
            if (key !== "images") {
                updateQuery[key] = updateFields[key];
            }
        }

        // Perform a single atomic update
        const result = await customerModel.findOneAndUpdate(
            { uniqueid },
            updateQuery,
            { new: true } // Returns the updated document
        );

        if (!result) {
            return res.status(404).json({ message: "No records found to update" });
        }

        res.status(200).send({ 
            message: "Update successful", 
            result, 
            success: true 
        });

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

        // Delete customer's images from S3
        if (getCustomerData.images && getCustomerData.images.length > 0) {
            for (const image of getCustomerData.images) {
                await deleteImageFromS3(image.s3Key);
            }
        }

        const allProposals = [];
        const allServices = [];

        getCustomerData.property.forEach((property) => {
            if (property.proposal) {
                allProposals.push(...property.proposal);
            }
            if (property.services) {
                allServices.push(...property.services);
            }
        });

        // Delete service images from S3
        if (allServices.length > 0) {
            const services = await serviceModel.find({ uniqueid: { $in: allServices } });
            for (const service of services) {
                if (service.images && service.images.length > 0) {
                    for (const image of service.images) {
                        await deleteImageFromS3(image.s3Key);
                    }
                }
            }
            await serviceModel.deleteMany({ uniqueid: { $in: allServices } });
        }

        if (allProposals.length > 0) {
            await proposalModel.deleteMany({ uniqueid: { $in: allProposals } });
        }

        await customerModel.deleteOne({ uniqueid: customerid });

        res.status(200).send({ 
            message: 'Customer and all related data (including images) have been deleted successfully.', 
            success: true 
        });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ 
            message: 'An error occurred while deleting the customer and associated data.', 
            error: error.message 
        });
    }
});


module.exports = route