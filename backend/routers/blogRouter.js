const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
// const upload = require('../middlewares/uploadBlogImage');
const { put } = require('@vercel/blob')
const multer = require("multer");


const upload = multer({
    storage: multer.memoryStorage(), // Store the file in memory as a buffer
});

router.post('/', upload.single('image'), blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', upload.single('image'), blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Check if the file exists
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        // Get file details from Multer
        const { buffer, originalname } = req.file;


        // Upload file to Vercel Blob
        const { url } = await put(originalname, buffer, { access: "public" });


        // Return the uploaded file's public URL
        res.status(200).json({ url });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Failed to upload the file." });
    }
});

module.exports = router;