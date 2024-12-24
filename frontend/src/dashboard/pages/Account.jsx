import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "./style.module.css";
import axios from "axios";

export default function Account() {
  const [admin, setAdmin] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    image: "",
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.post(
          "/auth/admin/verify",
          { token: Cookies.get("accessToken") },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
              "token-type": "access",
              "Content-Type": "application/json",
            },
          }
        );
        const { _id, name, email, image } = response.data;
        setAdmin({ _id, name, email, image });
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };

    fetchAdminDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    for (const key in admin) {
      if (admin[key] === "" && key !== "image") {
        alert(`${key} cannot be empty`);
        return;
      }
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.put(`/admins/${admin._id}`, {
        name: admin.name,
        email: admin.email,
        password: admin.password,
        role: admin.role,
        isActive: admin.isActive,
      });

      if (selectedFile) {
        const fileData = new FormData();
        fileData.append("admin-image", selectedFile);
        await axios.put(`/admins/${admin._id}`, fileData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("Admin updated successfully");
    } catch (error) {
      console.error("Error updating Admin:", error);
      alert("Failed to update admin");
    }
  };

  return (
    <>
      <div className={styles.account}>
        <h1>Account Information</h1>
        <div className={styles.accountinfo}>
          <div className={styles.inputs}>
            <form onSubmit={handleSubmit}>
              <div className={styles.name}>
                <label>Name</label>
                <input
                  type='text'
                  name='name'
                  value={admin.name}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.email}>
                <label>Email Address</label>
                <input
                  type='email'
                  name='email'
                  value={admin.email}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.password}>
                <label>Password</label>
                <input
                  type='password'
                  name='password'
                  value={admin.password || ""}
                  placeholder='Enter new password'
                  onChange={handleChange}
                />
              </div>
              <button type='submit'>Save</button>
            </form>
          </div>
          <div className={styles.image}>
            <div className={styles.icon}>
              {admin.image ? (
                <img
                  src={admin.image}
                  alt={admin.name}
                  crossOrigin='anonymous'
                />
              ) : (
                <i className='fa fa-user-circle'></i>
              )}
            </div>
            <label htmlFor='admin-image'>Upload Image</label>
            <input
              style={{ display: "none" }}
              type='file'
              name='admin-image'
              id='admin-image'
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
