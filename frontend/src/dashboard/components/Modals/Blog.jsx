import { useState, useEffect } from "react";
import styles from './style.module.css'
import axios from 'axios';

export default function Blog({ onClose, blog }) {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [currentBlog, setCurrentBlog] = useState({
    blogName: "",
    text: "",
    image: null,
  });
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);

    try {
      const response = await axios.post("/blog/upload", formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'json',
        });      

      setUploadedUrl(response.data.url); // Store the uploaded file's URL
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload the image.");
    }
  };

  useEffect(() => {
    if (blog) {
      setCurrentBlog({
        blogName: blog.blogName || "",
        text: blog.text || "",
        image: blog.image || null,
      });
    } else {
      setCurrentBlog({
        blogName: "",
        text: "",
        image: null,
      });
    }
  }, [blog]);

  const handleSubmit = async () => {
    try {
      if (blog) {
        console.log("Updating blog with ID:", currentBlog);
        await axios.put(`/blog/${blog._id}`, currentBlog, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        console.log("Adding new blog:", currentBlog);
        await axios.post("/blog/", currentBlog, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onClose();
    } catch (error) {
      console.error("Error submitting blog:", error);
    }
  };

  return (
    <div className={styles.modaloverlay}>
      <div className={styles.modalcontent}>
        <span className={styles.closeicon} onClick={onClose}>
          &times;
        </span>
        <h2>{blog ? "Update Blog" : "Add Blog"}</h2>
        <label>Blog Name:</label>
        <input
          type="text"
          value={currentBlog.blogName}
          onChange={(e) =>
            setCurrentBlog((prev) => ({ ...prev, blogName: e.target.value }))
          }
          className={styles.blogInput}
        />
        <label>Description:</label>
        <input
          type="text"
          value={currentBlog.text}
          onChange={(e) =>
            setCurrentBlog((prev) => ({ ...prev, text: e.target.value }))
          }
          className={styles.blogInput}
        />
        <label>Image:</label>
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          // onChange={(e) =>
          //   setCurrentBlog((prev) => ({
          //     ...prev,
          //     image: e.target.files[0],
          //   }))
          // }
          className={styles.blogInput}
        />
        <button onClick={handleUpload}>Upload</button>
        {/* <button onClick={handleSubmit}>
          {blog ? "Update Blog" : "Add Blog"}
        </button> */}
      </div>
    </div>
  );
}
