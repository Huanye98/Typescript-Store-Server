"use strict";
const uploader = require("../middlewares/cloudinary.middlewares");
const uploadImage = (req, res, next) => {
    if (!req.file) {
        res.status(400).json({
            errorMessage: "There was a problem uploading the image. Check image format and size.",
        });
        return;
    }
    res.json({ imageUrl: req.file.path });
};
module.exports = { uploadImage };
