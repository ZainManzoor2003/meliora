// const fs = require("fs");
// const path = require("path");
// const multer = require("multer");
// const crypto = require("crypto");

// const UPLOAD_PATH = process.env.IMG_UPLOAD_PATH;

// const uploadPath = `${UPLOAD_PATH}/admins`;
// if (!fs.existsSync(uploadPath)) {
//   console.log('hello');
  
//   fs.mkdir(uploadPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueName =
//       crypto.randomBytes(8).toString("hex") + path.extname(file.originalname);
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage: storage });

// module.exports = upload;
