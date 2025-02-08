const route = require('express').Router()
const adminModel = require('../model/adminSchema')
const customerModel = require('../model/customerSchema')
const serviceModel = require('../model/serviceSchema')
const proposalModel = require('../model/proposalSchema')
require('dotenv').config();
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const multerS3 = require('multer-s3');
const multer = require('multer');
const nodemailer = require('nodemailer')
const fs = require('fs')
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
        const newFilename = `service/${uniqueSuffix}${extension}`;
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

const uploadPdf = multer({
    dest: "uploads/", // Temporary storage for uploaded files
});


route.get('/', async(req, res) => {
    const serviceData = await serviceModel.find({})
    const proposalData = await proposalModel.find({})
    // console.log(serviceData)
    res.status(200).send({success: true, service: serviceData, proposal: proposalData})
})

// route.post('/', upload.any(), async (req, res) => {
//     // console.log(req.body)
//     const rawData = req.body;

//     try {
//         // Process uploaded files (images in additionalInfo)
//         const images = req.files.map(file => ({
//             uniqueid: uuidv4(),
//             s3Url: file.location, // Public URL of the file
//             s3Key: file.key, // S3 Key of the file
//         }));


//         // Create serviceClone object
//         const serviceClone = {
//             uniqueid: rawData?.serviceUniqueid,
//             createDate: rawData?.createDate,
//             name: rawData?.serviceItem,
//             type: rawData?.type,
//             description: rawData?.description,
//             quantity: rawData?.quantity,
//             sqft: rawData?.sqft,
//             frequency: JSON.parse(rawData?.frequency),
//             images: images, // Attach the uploaded images
//         };

//         // Create proposalClone object
//         const proposalClone = {
//             uniqueid: rawData?.uniqueid,
//             createDate: rawData?.createDate,
//             customer: rawData?.customer,
//             property: rawData?.property,
//             service: [rawData?.serviceUniqueid],
//         };

//         // Create proposal in the database
//         await proposalModel.create(proposalClone);

//         // Create service in the database
//         await serviceModel.create(serviceClone);

//         // Find customer by uniqueid
//         const customer = await customerModel.findOne({ uniqueid: rawData?.customer });

//         if (!customer) {
//             return res.status(404).send({ message: 'Customer not found' });
//         }

//         const { email, firstName, lastName } = customer?.personalDetails

//         // Find the property inside the customer object
//         const property = customer.property.find(prop => prop.uniqueid === rawData?.property);

//         if (property) {
//             // Push the serviceUniqueid and proposalClone.uniqueid into the respective arrays
//             property.services.push(rawData?.serviceUniqueid);
//             property.proposal.push(rawData?.uniqueid);
//         } else {
//             return res.status(404).send({ message: 'Property not found' });
//         }

//         // Save the updated customer object
//         await customer.save();


//         // Nodemailer transporter setup
//         const transporter = nodemailer.createTransport({
//             host: "smtp-relay.brevo.com",
//             port: 587,
//             secure: false,
//             auth: {
//                 user: process.env.BREVO_SMTP_MAIL,
//                 pass: process.env.BREVO_SMTP_API_KEY
//             },
//             tls: {
//                 rejectUnauthorized: false,
//             },
//         });
    
//         // Email content
//         const htmlContent = `<html>
//                                 <head>
//                                     <style>
//                                         body {
//                                             font-family: Arial, sans-serif;
//                                             line-height: 1.6;
//                                         }
//                                         .container {
//                                             padding: 20px;
//                                             max-width: 600px;
//                                             margin: auto;
//                                             border: 1px solid #ddd;
//                                             border-radius: 8px;
//                                             background-color: #f9f9f9;
//                                         }
//                                         .header {
//                                             text-align: center;
//                                             color: #4CAF50;
//                                         }
//                                         .content {
//                                             margin-top: 20px;
//                                         }
//                                         .footer {
//                                             margin-top: 20px;
//                                             text-align: center;
//                                             color: #777;
//                                             font-size: 12px;
//                                         }
//                                     </style>
//                                 </head>
//                                 <body>
//                                     <div class="container">
//                                         <h2 class="header">Your Proposal is Ready!</h2>
//                                         <div class="content">
//                                             <p>Dear <strong>${firstName} ${lastName}</strong>,</p>
//                                             <p>We are excited to inform you that your proposal has been successfully created. You can now review the details and take the next steps towards achieving your goals with us.</p>
//                                             <p><strong>Proposal ID:</strong> ${proposalClone?.uniqueid}</p>
//                                             <p>We look forward to assisting you further!</p>
//                                         </div>
//                                         <div class="footer">
//                                             <p>Thank you for choosing Indy Soft Wash.</p>
//                                         </div>
//                                     </div>
//                                 </body>
//                             </html>`;
    
//         // Send email
//         await transporter.sendMail({
//             from: `<${process.env.BREVO_SENDER_MAIL}>`,
//             to: email,
//             subject: `Your Proposal is Ready – Let's Move Forward!`,
//             html: htmlContent,
//         });


//         res.status(200).send({
//             message: 'Service and Proposal added successfully',
//             success: true,
//             service: serviceClone,
//             proposal: proposalClone,
//         });
//     } catch (error) {
//         console.error('Error in adding service and proposal:', error);
//         res.status(500).send({ message: 'Internal Server Error' });
//     }
// });

route.post('/', upload.any(), async (req, res) => {
    const rawData = req.body;

    try {
        // First check if proposal already exists for this property
        const customer = await customerModel.findOne({ uniqueid: rawData.customer });
        if (!customer) {
            return res.status(404).send({ message: 'Customer not found' });
        }

        const property = customer.property.find(prop => prop.uniqueid === rawData.property);
        if (!property) {
            return res.status(404).send({ message: 'Property not found' });
        }

        // Check if proposal already exists
        if (property?.proposal.includes(rawData.uniqueid) || property?.proposal?.length > 0) {
            return res.status(400).send({ 
                message: 'A proposal with this ID already exists for this property',
                success: false 
            });
        }

        const serviceIds = [];
        let serviceData = rawData.serviceData.map(item => JSON.parse(item));

        // Rest of the service processing code remains the same
        serviceData = await Promise.all(serviceData.map(async (serviceItem, i) => {
            const {
                serviceItem: name,
                serviceUniqueid,
                type,
                quantity,
                sqft,
                description,
                frequency
            } = serviceItem;

            // Extract and process images for the current service item
            const serviceImages = req.files
                .filter(file => file.fieldname.startsWith(`serviceData[${i}].additionalInfo`)) // Match all additionalInfo files for the current service
                .map(file => {
                    const matches = file.fieldname.match(/serviceData\[\d+\]\.additionalInfo\[(\d+)\]\.file/);
                    const additionalInfoIndex = matches ? parseInt(matches[1], 10) : null;

                    return {
                        uniqueid: uuidv4(),
                        s3Url: file.location || file.path, // Use S3 location or local file path
                        s3Key: file.key || file.filename, // Use S3 key or local filename
                        additionalInfoIndex, // Optional: Include the index for additional grouping if needed
                    };
                });

            // Create the service clone object
            const serviceClone = {
                uniqueid: serviceUniqueid,
                createDate: rawData?.createDate,
                name: name,
                type: type,
                description: description,
                quantity: quantity,
                sqft: sqft,
                frequency: frequency,
                images: serviceImages, // Attach processed images here
            };

            // Save the service to the database
            await serviceModel.create(serviceClone);

            // Add the serviceUniqueid to the array for later use
            serviceIds.push(serviceUniqueid);

            return serviceClone;
        }));

        // Create and save proposal
        const proposalClone = {
            uniqueid: rawData.uniqueid,
            createDate: rawData.createDate,
            customer: rawData.customer,
            property: rawData.property,
            service: serviceIds
        };

        await proposalModel.create(proposalClone);

        // Update property with services and proposal
        property.services.push(...serviceIds);
        property.proposal.push(rawData.uniqueid);
        await customer.save();

        // Email sending code remains the same
        const { email, firstName, lastName } = customer.personalDetails;
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.BREVO_SMTP_MAIL,
                pass: process.env.BREVO_SMTP_API_KEY
            },
            tls: { rejectUnauthorized: false }
        });

        // Email content
        const htmlContent = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        .container { padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; }
                        .header { text-align: center; color: #4CAF50; }
                        .content { margin-top: 20px; }
                        .footer { margin-top: 20px; text-align: center; color: #777; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2 class="header">Your Proposal is Ready!</h2>
                        <div class="content">
                            <p>Dear <strong>${firstName} ${lastName}</strong>,</p>
                            <p>We are excited to inform you that your proposal has been successfully created. You can now review the details and take the next steps towards achieving your goals with us.</p>
                            <p><strong>Proposal ID:</strong> ${proposalClone.uniqueid}</p>
                            <p>We look forward to assisting you further!</p>
                        </div>
                        <div class="footer">
                            <p>Thank you for choosing Indy Soft Wash.</p>
                        </div>
                    </div>
                </body>
            </html>`;

        // Send email
        await transporter.sendMail({
            from: `<${process.env.BREVO_SENDER_MAIL}>`,
            to: email,
            subject: `Your Proposal is Ready – Let's Move Forward!`,
            html: htmlContent
        });

        res.status(200).send({
            message: 'Service and Proposal added successfully',
            success: true,
            service: serviceData,
            proposal: proposalClone
        });
    } catch (error) {
        console.error('Error in adding service and proposal:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

route.post('/extra', upload.any(), async (req, res) => {
    const rawData = req.body;
    const { customerid, proposalid, propertyid, uniqueid } = rawData;

    // Process uploaded files (images in additionalInfo)
    const images = req.files.map(file => ({
        uniqueid: uuidv4(),
        s3Url: file.location, // Public URL of the file
        s3Key: file.key, // S3 Key of the file
    }));

    // console.log(images)
    
    // Construct serviceClone object
    const serviceClone = {
        uniqueid,
        createDate: rawData?.createDate,
        name: rawData?.name,
        type: rawData?.type,
        description: rawData?.description,
        quantity: rawData?.quantity,
        sqft: rawData?.sqft,
        frequency: JSON.parse(rawData?.frequency),
        activePlan: rawData?.activePlan,
        images
    };

    try {
        await serviceModel.create(serviceClone);

        const proposalUpdateResult = await proposalModel.updateOne(
            { uniqueid: proposalid },
            { $push: { service: uniqueid } }
        );

        if (proposalUpdateResult.modifiedCount === 0) {
            return res.status(404).send({ message: 'Proposal not found or update failed' });
        }

        // 3. Find the customer by uniqueid
        const customer = await customerModel.findOne({ uniqueid: customerid });

        if (!customer) {
            return res.status(404).send({ message: 'Customer not found' });
        }

        // 4. Find the property inside the customer object
        const property = customer.property.find((prop) => prop.uniqueid === propertyid);

        if (!property) {
            return res.status(404).send({ message: 'Property not found' });
        }

        // 5. Add service and proposal to the property
        property.services = property.services || [];
        property.services.push(uniqueid);

        // Save the updated customer object
        await customer.save();

        // 6. Send a success response
        res.status(200).send({
            message: 'Service added successfully',
            success: true,
            result: serviceClone,
        });
    } catch (error) {
        console.error('Error in adding service and proposal:', error);

        // Return a more informative error message for debugging
        res.status(500).send({
            message: 'An error occurred while adding the service and updating related data.',
            error: error.message,
        });
    }
});

route.post('/custom', async(req, res) => {
    const customServices = req.body
    await adminModel.updateOne({username: 'admin'},{$push: {customServices: customServices}})
    res.status(200).send({ success: true, result: customServices })
})

route.put('/custom', async (req, res) => {
    const customService = req.body;
    const { uniqueid } = customService;

    try {
        // Find and update the specific customService entry by uniqueid
        const result = await adminModel.updateOne(
            { username: 'admin', 'customServices.uniqueid': uniqueid }, // Match admin and the customService with uniqueid
            { $set: { 'customServices.$': customService } } // Update the matched customService
        );

        res.status(200).send({ success: true, result: customService });
    } catch (error) {
        console.error('Error updating custom service:', error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
});

route.put('/plan', async(req, res) => {
    const { service, frequency } = req.body
    await serviceModel.updateOne({ uniqueid: service }, { $set: { activePlan: frequency } })
    res.status(200).send({success: true})
})

route.put('/', upload.any(), async (req, res) => {
    const { allServices, removedImages, removedFrequency } = req.body;
    const parsedServices = JSON.parse(allServices);

    if (!Array.isArray(parsedServices) || parsedServices.length === 0) {
        return res.status(400).json({ message: "Invalid input: Provide an array of services." });
    }

    try {
        // 1. First fetch all services in one query
        const serviceIds = parsedServices.map(service => service.uniqueid);
        const existingServices = await serviceModel.find({ uniqueid: { $in: serviceIds } });
        const servicesMap = new Map(existingServices.map(service => [service.uniqueid, service]));

        // 2. Process new images and map them to services
        const serviceImageMap = new Map();
        if (req.files?.length > 0) {
            req.files.forEach(file => {
                const serviceId = file.originalname.split('_')[0];
                const imageData = {
                    uniqueid: uuidv4(),
                    s3Url: file.location,
                    s3Key: file.key,
                };

                if (!serviceImageMap.has(serviceId)) {
                    serviceImageMap.set(serviceId, []);
                }
                serviceImageMap.get(serviceId).push(imageData);
            });
        }

        // 3. Process removedImages
        const imagesToRemoveMap = new Map();
        if (removedImages) {
            const imagesToRemove = JSON.parse(removedImages);
            imagesToRemove.forEach(({ serviceId, imageId }) => {
                if (!imagesToRemoveMap.has(serviceId)) {
                    imagesToRemoveMap.set(serviceId, new Set());
                }
                imagesToRemoveMap.get(serviceId).add(imageId);
            });
        }

        // Parse removedFrequency if it exists
        const frequencyRemovalMap = new Map();
        if (removedFrequency) {
            const parsedRemovedFrequency = JSON.parse(removedFrequency);
            Object.entries(parsedRemovedFrequency).forEach(([serviceId, frequencies]) => {
                frequencyRemovalMap.set(serviceId, frequencies);
            });
        }

        // 4. Prepare bulk operations
        const bulkOperations = parsedServices.map(service => {
            const { uniqueid, ...updatedFields } = service;
            const existingService = servicesMap.get(uniqueid);
            
            if (!existingService) {
                console.warn(`Service not found for ID: ${uniqueid}`);
                return null;
            }

            // Handle image updates
            let updatedImages = [...(existingService.images || [])];

            // Remove deleted images
            if (imagesToRemoveMap.has(uniqueid)) {
                const imageIdsToRemove = imagesToRemoveMap.get(uniqueid);
                updatedImages = updatedImages.filter(img => {
                    if (imageIdsToRemove.has(img.uniqueid)) {
                        // Queue S3 deletion
                        if (img.s3Key) {
                            deleteImageFromS3(img.s3Key).catch(err => 
                                console.error(`Failed to delete S3 image: ${img.s3Key}`, err)
                            );
                        }
                        return false;
                    }
                    return true;
                });
            }

            // Add new images
            if (serviceImageMap.has(uniqueid)) {
                updatedImages = [...updatedImages, ...serviceImageMap.get(uniqueid)];
            }

            // Handle frequency removals
            let updatedFrequency = [...(existingService.frequency || [])];
            if (frequencyRemovalMap.has(uniqueid)) {
                const frequenciesToRemove = frequencyRemovalMap.get(uniqueid);
                updatedFrequency = updatedFrequency.filter(freq => 
                    !frequenciesToRemove.includes(freq.name)
                );
            }

            return {
                updateOne: {
                    filter: { uniqueid },
                    update: {
                        $set: {
                            ...updatedFields,
                            images: updatedImages,
                            frequency: updatedFrequency
                        }
                    }
                }
            };
        }).filter(Boolean);

        // 5. Execute bulk update in a single operation
        if (bulkOperations.length > 0) {
            await serviceModel.bulkWrite(bulkOperations);
        }

        // 6. Fetch updated services
        const updatedServices = await serviceModel.find({ uniqueid: { $in: serviceIds } });

        res.status(200).send({ 
            message: "Services and images updated successfully.", 
            success: true,
            data: updatedServices
        });

    } catch (error) {
        console.error("Error updating services:", error);
        res.status(500).send({ 
            message: "Failed to update services.", 
            error: error.message 
        });
    }
});

route.put('/status', async (req, res) => {
    const { status, proposalid, date } = req.body;

    // Validate input
    // if (typeof status !== "boolean" || !proposalid || !date) {
    //     return res.status(400).send({ message: 'Invalid input data', success: false });
    // }
    
    // console.log(getStatus)

    try {
        // Update the proposal status in the database
        const result = await proposalModel.updateOne(
            { uniqueid: proposalid },
            { $set: { 'status.type': status, 'status.date': date } }
        );

        // Check if any document was updated
        if (result.modifiedCount === 0) { // Use modifiedCount instead of nModified
            return res.status(404).send({ message: 'Proposal not found or status is already set', success: false });
        }

        // Send success response
        res.status(200).send({ message: 'Proposal status updated successfully', success: true });
    } catch (error) {
        // Catch any errors and send a 500 response
        console.error("Error updating proposal status:", error.message);
        res.status(500).send({ message: 'Error updating proposal status', success: false });
    }
});

route.post("/status", uploadPdf.single("pdf"), async (req, res) => {
    const { status, proposalid, date, email } = req.body;

    if (!proposalid || !email) {
        return res.status(400).send({ message: "Proposal ID and email are required", success: false });
    }

    try {
        // Update the proposal status in the database
        const result = await proposalModel.updateOne(
            { uniqueid: proposalid },
            { $set: { "status.type": status, "status.date": date } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send({
                message: "Proposal not found or status is already set",
                success: false,
            });
        }

        // Get the uploaded PDF file
        const pdfFilePath = req.file.path;

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.BREVO_SMTP_MAIL,
                pass: process.env.BREVO_SMTP_API_KEY,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // Send Email with PDF Attachment
        const mailOptions = {
            from: `<${process.env.BREVO_SENDER_MAIL}>`,
            to: email,
            subject: "Your Proposal Agreement is Ready",
            html: `<p>Dear Customer,</p>
                   <p>We are excited to share your proposal agreement. Please find the details attached as a PDF.</p>
                   <p>Best regards,<br>Your Company Name</p>`,
            attachments: [
                {
                    filename: "Proposal_Agreement.pdf",
                    path: pdfFilePath,
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        // Clean up the uploaded PDF file
        fs.unlinkSync(pdfFilePath);

        res.status(200).send({ message: "Proposal status updated and email sent successfully", success: true });
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).send({ message: "Internal server error", success: false });
    }
});

route.post('/delete', async (req, res) => {
    const { serviceid, customerid, propertyid, proposalid } = req.body;

    if (!serviceid || !customerid || !propertyid || !proposalid) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {

        const service = await serviceModel.findOne({ uniqueid: serviceid });

        if(service?.images?.length >= 1) {
            const {images} = service;
            const urls = images?.map(value => value.s3Key)
            for (const url of urls) {
                await deleteImageFromS3(url);  // Ensure you pass the URL to the delete function
            }
        }

        // Delete the service from the serviceModel
        await serviceModel.deleteOne({ uniqueid: serviceid });

        // Remove the service ID from the services array in proposalModel
        await proposalModel.updateOne(
            { uniqueid: proposalid },
            { $pull: { service: serviceid } }
        );

        // Remove the service ID from the services array in customerModel's property
        await customerModel.updateOne(
            { uniqueid: customerid, 'property.uniqueid': propertyid },
            { $pull: { 'property.$.services': serviceid } }
        );

        return res.status(200).json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

route.delete('/:id', async (req, res) => {
    const serviceid = req.params.id;

    try {
        // Use $pull to remove the customService that matches the uniqueid
        const result = await adminModel.updateOne(
            { username: 'admin' }, // Filter to find the admin document
            { $pull: { customServices: { uniqueid: serviceid } } } // Remove service by uniqueid
        );

        if (result.modifiedCount > 0) {
            res.status(200).send({ message: 'Service deleted successfully.', success: true });
        } else {
            res.status(404).send({ message: 'Service not found or already deleted.' });
        }
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).send({ message: 'Internal server error.' });
    }
});

route.post('/proposal/delete', async (req, res) => {
    const { serviceid, customerid, propertyid, proposalid } = req.body;

    if (!Array.isArray(serviceid) || serviceid.length === 0 || !customerid || !propertyid || !proposalid) {
        return res.status(400).json({ success: false, message: 'Missing required fields or invalid input' });
    }

    try {

        const services = await serviceModel.find({ uniqueid: { $in: serviceid } });

        const imageKeys = services.flatMap((service) => {
            return Array.isArray(service.images)
                ? service.images.map((img) => img.s3Key).filter(Boolean) // Ensure valid keys
                : [];
        });

        for (const key of imageKeys) {
            await deleteImageFromS3(key);
        }

        await proposalModel.deleteOne({ uniqueid: proposalid });

        await serviceModel.deleteMany({ uniqueid: { $in: serviceid } });

        const customerUpdateResult = await customerModel.updateOne(
            {
                uniqueid: customerid,
                'property.uniqueid': propertyid, // Find the specific property in the customer
            },
            {
                $pull: {
                    'property.$.proposal': proposalid, // Remove the proposalid from the proposals array
                    'property.$.services': { $in: serviceid } // Remove all service IDs in the serviceid array
                }
            }
        );

        // Check if the customer and property were found and updated
        if (customerUpdateResult.matchedCount === 0) {
            return res.status(404).send({ success: false, message: 'Customer or property not found' });
        }

        const customerData = await customerModel.findOne({uniqueid: customerid})
        const { email, firstName, lastName } = customerData?.personalDetails 
        const customerProperty = customerData?.property?.find(value => value.uniqueid === propertyid)
        const { propertyName } = customerProperty

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
        const htmlContent = `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proposal Deletion Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .email-content {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-content">
            <p>Dear <strong>${firstName} ${lastName}</strong>,</p>

            <p>I hope this message finds you well.</p>

            <p>We are writing to inform you that, as per your request, your proposal for "<strong>${propertyName}</strong>" has been successfully deleted from our system. If this was an error or if you require further assistance with the proposal, please do not hesitate to reach out to us.</p>

            <p>We understand that this may be an important matter, and we are here to help with any questions or additional steps you might need.</p>

            <p>Thank you for your understanding, and we remain at your service.</p>

            <p>Best regards,</p>
            <p><strong>Indy Soft Wash</strong><br>
        </div>
        <div class="footer">
            <p>If you did not request this deletion or believe this to be an error, please contact us immediately.</p>
        </div>
    </div>
</body>
</html>`;
    
        // Send email
        await transporter.sendMail({
            from: `<${process.env.BREVO_SENDER_MAIL}>`,
            to: email,
            subject: `Your Proposal is Ready – Let's Move Forward!`,
            html: htmlContent,
        });

        return res.status(200).send({ success: true, message: 'Proposal and related services deleted successfully' });
    } catch (error) {
        console.error('Error deleting proposal and services:', error);
        return res.status(500).send({ success: false, message: 'Internal server error' });
    }
});

route.put('/image', upload.any(), async (req, res) => {
    const { serviceId, removedImages } = req.body;
    try {
        // Find the existing service
        const service = await serviceModel.findOne({ uniqueid: serviceId });
        if (!service) {
            return res.status(404).send({ 
                success: false, 
                message: 'Service not found' 
            });
        }

        // Handle image deletions if any
        if (removedImages && Array.isArray(JSON.parse(removedImages))) {
            const imagesToRemove = JSON.parse(removedImages);
            
            // Delete images from S3
            for (const imageId of imagesToRemove) {
                const imageToDelete = service.images.find(img => img.uniqueid === imageId);
                if (imageToDelete?.s3Key) {
                    await deleteImageFromS3(imageToDelete.s3Key);
                }
            }

            // Remove deleted images from service.images array
            service.images = service.images.filter(
                img => !imagesToRemove.includes(img.uniqueid)
            );
        }

        // Process new uploaded files
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                uniqueid: uuidv4(),
                s3Url: file.location, // S3 URL of the file
                s3Key: file.key, // S3 Key for future deletion
            }));

            // Add new images to existing images array
            service.images = [...service.images, ...newImages];
        }

        // Save updated service
        await service.save();

        res.status(200).send({
            success: true,
            message: 'Service images updated successfully',
            data: service.images
        });

    } catch (error) {
        console.error('Error updating service images:', error);
        return res.status(500).send({ 
            success: false, 
            message: 'Internal server error',
            error: error.message 
        });
    }
});


module.exports = route;



{/* <p><a href="[Proposal Link]" target="_blank" style="color: #4CAF50; text-decoration: none;">View Proposal</a></p> 
<p><strong>Proposal Details:</strong> You can access your proposal by clicking the link below:</p>
<p>Should you have any questions or need further assistance, feel free to reply to this email or contact us at <a href="mailto:[Your Support Email]">[Your Support Email]</a>.</p> */}