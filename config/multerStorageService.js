// SET STORAGE
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const { userID, content } = req.body;
    const folder = path.join(__dirname, `../uploads/${userID}`);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    cb(null, `uploads/${userID}`);
  },
  filename: function(res, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage
});

const commentStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const { postID, content } = req.body;
    const folder = path.join(__dirname, `../comments/${postID}/`);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    cb(null, `comments/${postID}`);
  },
  filename: function(res, file, cb) {
    cb(null, file.originalname);
  }
});

const uploadComment = multer({
  storage: commentStorage
});

module.exports.upload = upload;
module.exports.uploadComment = uploadComment;
