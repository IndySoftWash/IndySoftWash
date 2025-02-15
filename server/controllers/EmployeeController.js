const route = require('express').Router()
const employeeData = require('../model/employeeSchema')
const adminData = require('../model/adminSchema')
const sha = require('sha1')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const multerS3 = require('multer-s3');
const multer = require('multer');
const { s3Client, deleteImageFromS3 } = require('../utils/aws')


route.use('/password', require('./subController/PasswordController'))

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
        const newFilename = `employee/${uniqueSuffix}${extension}`;
        cb(null, newFilename); // S3 key (path within the bucket)
    },
});

// Multer instance with limits and file type filter
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
    fileFilter: (req, file, cb) => {
        cb(null, true);
    },
});


route.get('/', async(req, res) => {
    const getEmployee = await employeeData.find({})
    res.status(200).send({ success : true, result: getEmployee })
})

route.get('/:id', async(req, res) => {
    const {id} = req.params
    const getEmployee = await employeeData.findOne({uniqueid : id})
    res.status(200).send({ success : true, result: getEmployee })
})

route.post('/login', async(req, res) => {
    const { email, password } = req.body
    const getEmployee = await employeeData.findOne({email})
    if(getEmployee) {
        if(getEmployee?.password === sha(password)) {
            const ID = {id : getEmployee?._id};
            const token = jwt.sign(ID, process.env.TOKEN_KEY)
            res.send({ success: true, token, result : getEmployee })
        } else res.send({ success: false, type: 'password' })
    } else res.send({ success: false, type: 'email' })
})

route.post('/', upload.single('profileImage'), async (req, res) => {
    try {
        // Check for authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send({ success: false, message: 'Authorization header missing' });
        }

        // Verify and decode JWT token
        const decoded = jwt.verify(authHeader, process.env.TOKEN_KEY);

        // Find employee in the database
        const getAdmin = await adminData.findOne({ _id: decoded.id });
        if (!getAdmin) {
            return res.status(404).send({ success: false, message: 'Admin not found' });
        }

        // Extract fields from req.body according to employeeSchema
        const {
            firstName,
            lastName,
            address,
            status,
            role,
            phone,
            email,
            password,
            uniqueid,
            createdAt,
        } = req.body;

        if(role === 'root') {
            return res.status(400).send({ success: false, message: 'Root cannot be created' });
        }

        const getEmployee = await employeeData.findOne({uniqueid})
        const getEmployeeEmail = await employeeData.findOne({ email : email })
        if(getEmployee) {
            return res.status(400).send({ success: false, message: 'Employee already exists' });
        }
        if(getEmployeeEmail) {
            return res.status(400).send({ success: false, message: 'Email already exists' });
        }

        const profileImage = {
            s3Url : req.file?.location,
            s3Key : req.file?.key,
        }
        // Prepare update fields
        const updateFields = {
            firstName,
            lastName,
            address,
            status,
            role,
            phone,
            email,
            profileImage,
            password: sha(password), // Hash the password before saving
            uniqueid,
            createdAt,
        };

        await employeeData.create(updateFields);

        return res.status(200).send({ success: true, message: 'Employee created successfully', result : updateFields });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ success: false, message: 'Invalid token' });
        }

        console.error('Error updating profile:', error);
        return res.status(500).send({ success: false, message: 'Internal server error' });
    }
});

route.put('/', upload.single('profileImage'), async(req, res) => {
    try {
        
        // Extract fields from req.body according to employeeSchema
        const {
            firstName,
            lastName,
            address,
            status,
            role,
            phone,
            profileImage,
            createdAt,
            email,
            uniqueid,
        } = req.body;

        const getEmployee = await employeeData.findOne({uniqueid})
        let newProfileImage

        // Check if a new profile image is provided
        if (req.file) {
            // Delete the old image from S3
            await deleteImageFromS3(getEmployee.profileImage.s3Key);

            // Update the profileImage field
            newProfileImage = {
                s3Url: req.file.location,
                s3Key: req.file.key,
            };
        } else {
            newProfileImage = JSON.parse(profileImage)
        }

        // Prepare update fields
        const updateFields = {
            firstName,
            lastName,
            address,
            status,
            profileImage: newProfileImage,
            role,
            phone,
            email,
            uniqueid,
            updatedAt: createdAt,
        };

        

        await employeeData.updateOne({ _id: decoded.id }, { $set: updateFields });

        return res.status(200).send({ success: true, message: 'Employee updated successfully', result: updateFields });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ success: false, message: 'Invalid token' });
        }

        console.error('Error updating employee:', error);
        return res.status(500).send({ success: false, message: 'Internal server error' });
    }
})

route.delete('/', async(req, res) => {
    const {uniqueid} = req.body
    const getEmployee = await employeeData.findOne({uniqueid})
    if(!getEmployee) {
        return res.status(400).send({ success: false, message: 'Employee not found' });
    }
    await deleteImageFromS3(getEmployee.profileImage.s3Key);    
    await employeeData.deleteOne({uniqueid})
    return res.status(200).send({ success: true, message: 'Employee deleted successfully' });
})

route.put('/password', async(req, res) => {
    const {uniqueid, password, newPassword} = req.body
    const getEmployee = await employeeData.findOne({uniqueid})
    if(!getEmployee) {
        return res.status(400).send({ success: false, message: 'Employee not found' });
    }
    if(getEmployee?.password !== sha(password)) {
        return res.status(400).send({ success: false, message: 'Invalid current password' });
    }
    await employeeData.updateOne({uniqueid}, {$set: {password: sha(newPassword)}})
    return res.status(200).send({ success: true, message: 'Password updated successfully' });
})


module.exports = route;