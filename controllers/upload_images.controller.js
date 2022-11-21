const db = require("../models");
const Post = db.post;
const User = db.user;
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const { Readable } = require('stream');
const { BlobServiceClient, StorageSharedKeyCredential, newPipeline } = require('@azure/storage-blob');
const { log } = require("console");
const uploadOptions = { bufferSize: 4 * 1024 * 1024, maxBuffers: 1 };

const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME,
    process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY);
const pipeline = newPipeline(sharedKeyCredential);

const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    pipeline
);

async function checkImageandUpload(req, res, randomName) {
    try {
        console.log(req.files[0]);
        if (!req.files[0].mimetype.startsWith("image/")) {
            res.status(400).send({ message: "File is not image" });
            return;
        }
        if (req.files[0].size > 8000000) {
            res.status(400).send({ message: "File is too large" });
            return;
        }
        const data = req.files[0].buffer;
        const containerClient = blobServiceClient.getContainerClient("images");;
        const blockBlobClient = containerClient.getBlockBlobClient(randomName);

        const transformedReadableStream = Readable.from(data);


        const uploadBlobResponse = await blockBlobClient.uploadStream(
            transformedReadableStream,
            uploadOptions.bufferSize,
            uploadOptions.maxBuffers,
            { blobHTTPHeaders: { blobContentType: req.files[0].mimetype } }
        );
    } catch (err) {;
        console.log("error", err);
        res.status(500)}
}

exports.insertpostimage = async (req, res) => {
    try {
        const randomName = uuidv4();
        checkImageandUpload( req, res, randomName ).then(() => {
            const insertpost = new Post({
                text: req.body.text,
                author: req.userId,
                post_time: moment().format(),
                visibility: req.body.visibility,
                post_images: `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/images/${randomName}`,
            });
            insertpost.save((err, insertpost) => {
                if (err) {
                    res.status(500).json({ message: err });
                    return;
                } else {
                    res.json({ message: "Post successfully!" });
                }
            });
        });
    } catch (err) {
        console.log("error", err);
        res.status(500)
    }
}

exports.changeprofilepicture = async (req, res) => {
    try {
        const randomName = uuidv4();
        checkImageandUpload( req, res,randomName ).then(() => {
            const updatepp = User.findOneAndUpdate(
                { _id: req.userId },
                { images: `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/images/${randomName}` });
            updatepp.exec((err, updatepp) => {
                if (err) {
                    res.status(500).json({ message: err });
                    return;
                } else {
                    console.log(updatepp);
                    res.json({ images: `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/images/${randomName}` });
                }
            }
            );
        });
    } catch (err) {
        console.log("error", err);
        res.status(500)
    }
}