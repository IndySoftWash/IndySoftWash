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
        const newFilename = `workOrder/${uniqueSuffix}${extension}`;
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

route.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const service = await serviceModel.findOne({ uniqueid: id });
        if (!service) {
            return res.status(404).send({ success: false, message: 'Service not found' });
        }
        res.status(200).send({ success: true, message: 'Service fetched successfully', result: service?.workOrder });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
})

route.post('/:id', upload.array('images'), async (req, res) => {
    try {
        const { id } = req.params;
        const { workOrder } = req.body;
        const admin = await adminModel.findOne({});
        admin.workOrderCount += 1; // Increment workOrderCount by 1
        const workOrderCount = String(admin.workOrderCount).padStart(4, '0'); // Store the incremented value
        await admin.save();
        const service = await serviceModel.findOne({ uniqueid: id });
        if (!service) {
            return res.status(404).send({ success: false, message: 'Service not found' });
        }
        const images = req.files.map(file => ({
            uniqueid: uuidv4(),
            s3Url: file.location,
            s3Key: file.key
        }));
        // Merge images with workOrder data
        const workOrderData = JSON.parse(workOrder);
        const dataObject = {
            createDate: workOrderData.createDate,
            updateDate: workOrderData.createDate,
            status: "created",
            name: workOrderData.name,
            workOrder: workOrderCount,
            description: workOrderData.description,
            serviceAddress: workOrderData.serviceAddress,
            instruction: workOrderData.instructions,
            assign: workOrderData.assignTo,
            checkList: workOrderData.checkList,
            timing: {
                startDate: workOrderData.startDate,
                endDate: workOrderData.endDate,
            },
            images: images
        }
        // Replace the entire workOrder object with merged data
        service.workOrder = dataObject;
        await service.save();
        res.status(200).send({ success: true, message: 'Work order created successfully', result: dataObject });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
})

route.put('/:id', upload.array('images'), async (req, res) => {
    try {
        const { id } = req.params;
        const { workOrder, removedImages } = req.body;
        const service = await serviceModel.findOne({ uniqueid: id });
        if (!service) {
            return res.status(404).send({ success: false, message: 'Service not found' });
        }
        
        const workOrderData = JSON.parse(workOrder);        
        if(removedImages){
            const removedImagesArray = JSON.parse(removedImages);

            // Delete existing images from S3 if they are in removedImages
            if (removedImagesArray && Array.isArray(removedImagesArray)) {
                await Promise.all(
                    removedImagesArray.map(async (s3Key) => {
                        await deleteImageFromS3(s3Key);
                        // Remove the image from the workOrder data
                        workOrderData.images = workOrderData.images.filter(image => image.s3Key !== s3Key);
                    })
                );
            }
        }


        // Check if new images are uploaded
        const images = req.files ? req.files.map(file => ({
            uniqueid: uuidv4(),
            s3Url: file.location,
            s3Key: file.key
        })) : [];

        if (images.length > 0) {
            workOrderData.images = [...(workOrderData.images || []), ...images]; // Append new images
        }

        const dataObject = {
            createDate: workOrderData.createDate,
            updateDate: workOrderData.createDate,
            status: "created",
            name: workOrderData.name,
            workOrder: workOrderData.workOrder,
            description: workOrderData.description,
            serviceAddress: workOrderData.serviceAddress,
            instruction: workOrderData.instructions,
            assign: workOrderData.assignTo,
            checkList: workOrderData.checkList,
            timing: {
                startDate: workOrderData.startDate,
                endDate: workOrderData.endDate,
            },
            images: workOrderData.images
        }

        service.workOrder = dataObject;
        await service.save();
        
        res.status(200).send({ success: true, message: 'Work order updated successfully', result: dataObject });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
});

route.delete('/:id/workorder', async (req, res) => {
    try {
        const { id } = req.params;
        const service = await serviceModel.findOne({ uniqueid: id });
        if (!service) {
            return res.status(404).send({ success: false, message: 'Service not found' });
        }

        // Optionally, delete images from S3 if needed
        if (service.workOrder.images && Array.isArray(service.workOrder.images)) {
            await Promise.all(
                service.workOrder.images.map(async (image) => {
                    await deleteImageFromS3(image.s3Key);
                })
            );
        }

        // Delete the work order from the service
        service.workOrder = null; // or service.workOrder = {}; if you want to keep the structure
        await service.save();

        res.status(200).send({ success: true, message: 'Work order deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
});

module.exports = route;


