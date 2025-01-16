const route = require('express').Router()
const adminData = require('../model/adminSchema')
const sha = require('sha1')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const multerS3 = require('multer-s3');
const multer = require('multer');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

route.use('/password', require('./subController/PasswordController'))

// AWS SDK Configuration
const s3Client = new S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const deleteImageFromS3 = async (imageKey) => {
    try {
        if (!imageKey) {
            console.error("Image key is missing");
            return;
        }

        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageKey,
        };

        // console.log(`Attempting to delete image: ${imageKey}`);
        const command = new DeleteObjectCommand(deleteParams);
        const result = await s3Client.send(command);

        console.log(`Image ${imageKey} successfully deleted from S3`, result);
    } catch (error) {
        console.error(`Error deleting image ${imageKey} from S3:`, error);
        throw new Error(`Failed to delete image ${imageKey} from S3`);
    }
};

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
        const newFilename = `profile/${uniqueSuffix}${extension}`;
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
    const getAdmin = await adminData.find({})
    res.status(200).send({ success : true, result: getAdmin[0] })
})

route.post('/', async(req, res) => {
    const { email, password } = req.body
    const getAdmin = await adminData.findOne({email})
    if(getAdmin) {
        if(getAdmin?.password === sha(password)) {
            const ID = {id : getAdmin?._id};
            const token = jwt.sign(ID, process.env.TOKEN_KEY)
            res.send({ success: true, token })
        } else res.send({ success: false, type: 'password' })
    } else res.send({ success: false, type: 'email' })
})

route.post('/profile', async (req, res) => {
    try {
        // Check for authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send({ success: false, message: 'Authorization header missing' });
        }

        // Verify and decode JWT token
        const decoded = jwt.verify(authHeader, process.env.TOKEN_KEY);

        // Find admin in the database
        const getAdmin = await adminData.findOne({ _id: decoded.id });
        if (!getAdmin) {
            return res.status(404).send({ success: false, message: 'Admin not found' });
        }

        // Extract fields from req.body
        const {
            firstName,
            lastName,
            address,
            shirtSize,
            phone,
            email
        } = req.body;

        // Update admin profile with only the fields provided
        const updateFields = {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(address && { address }),
            ...(shirtSize && { shirtSize }),
            ...(phone && { phone }),
            ...(email && { email })
        };

        await adminData.updateOne({ _id: decoded.id }, { $set: updateFields });

        return res.status(200).send({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ success: false, message: 'Invalid token' });
        }

        console.error('Error updating profile:', error);
        return res.status(500).send({ success: false, message: 'Internal server error' });
    }
});

// Profile Image Route
route.post('/profile-image', upload.single('profileImage'), async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send({ success: false, message: 'Authorization header missing' });
        }

        // Verify and decode JWT token
        const decoded = jwt.verify(authHeader, process.env.TOKEN_KEY);

        // Find admin in the database
        const admin = await adminData.findOne({ _id: decoded.id });
        if (!admin) {
            return res.status(404).send({ success: false, message: 'Admin not found' });
        }

        // Delete existing profile image if present
        if (admin.profileImage && admin.profileImage.s3Key) {
            await deleteImageFromS3(admin.profileImage.s3Key);
        }

        // Get new image details from S3
        const newProfileImage = {
            s3Url: req.file.location, // S3 public URL
            s3Key: req.file.key, // S3 key
        };

        // Update admin profile with new profile image
        await adminData.updateOne(
            { _id: decoded.id },
            { $set: { profileImage: newProfileImage } }
        );

        res.status(200).send({ success: true, message: 'Profile image updated successfully', profileImage: newProfileImage });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ success: false, message: 'Invalid token' });
        }

        console.error('Error updating profile image:', error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
});

route.put('/', async(req, res) => {

})

route.delete('/', async(req, res) => {

})





module.exports = route;