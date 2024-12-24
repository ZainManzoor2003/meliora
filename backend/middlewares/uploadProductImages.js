// const fs = require("fs");
// const path = require("path");
// const multer = require("multer");
// const crypto = require("crypto");

// const UPLOAD_PATH = process.env.IMG_UPLOAD_PATH;

// const ensureDirectoryExists = (dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let uploadPath;

//     if (file.fieldname === "frontImage" || file.fieldname === "backImage") {
//       uploadPath = `${UPLOAD_PATH}/products`;
//     } else if (file.fieldname.startsWith("step")) {
//       uploadPath = `${UPLOAD_PATH}/products/usage`;
//     }

//     ensureDirectoryExists(uploadPath);
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueName =
//       crypto.randomBytes(8).toString("hex") + path.extname(file.originalname);
//     cb(null, uniqueName);
//   },
// });

// const uploadMultiple = multer({
//   storage,
// }).fields([
//   { name: "frontImage", maxCount: 1 },
//   { name: "backImage", maxCount: 1 },
//   { name: "steps[step1][image]", maxCount: 1 },
//   { name: "steps[step2][image]", maxCount: 1 },
//   { name: "steps[step3][image]", maxCount: 1 },
// ]);

// const multerErrorHandler = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     console.log(err);
//     return res.status(400).json({ error: err.message });
//   }
//   if (err) {
//     return res
//       .status(500)
//       .json({ error: "Internal server error", message: err.message });
//   }
//   next();
// };

// module.exports = { uploadMultiple, multerErrorHandler };
