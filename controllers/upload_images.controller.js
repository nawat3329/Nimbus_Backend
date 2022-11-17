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

exports.insertpostimage = async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    randomName = uuidv4();
    if (req.files[0].mimetype != "image/png" && req.files[0].mimetype != "image/jpeg") {
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

    try {
        const uploadBlobResponse = await blockBlobClient.uploadStream(
            transformedReadableStream,
            uploadOptions.bufferSize,
            uploadOptions.maxBuffers,
            { blobHTTPHeaders: { blobContentType: "image/jpeg" } }
        );
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
        console.log("here");
        console.log(uploadBlobResponse.url);

    } catch (err) {
        console.log("error", err);
        res.status(500)
    }


}