const uploader = require("../middlewares/cloudinary.middlewares");

const uploadImage = (req, res, next) => {
  uploader.single("image")
    if (!req.file) {
      // this will happend if cloudinary rejects the image for any reason
      res.status(400).json({
        errorMessage:
          "There was a problem uploading the image. Check image format and size.",
      });
      return;
    }
    res.json({ imageUrl: req.file.path });
};

module.exports = { uploadImage };
