/* eslint-disable no-unused-vars */
import { useState } from "react";
import styles from "./style.module.css";
import axios from "axios";

// Transform data to the required schema for API
const transformDataToSchema = (formData) => {
  const {
    name,
    detail,
    subsection: subDetail,
    description,
    price,
    stock: stockQuantity,
    sizes,
    frontImage,
    backImage,
    steps,
    usageTitle,
  } = formData;

  const transformedData = {
    name,
    detail,
    subDetail,
    description,
    price,
    sizes: [
      { size: "Small", quantity: sizes.small.quantity },
      { size: "Medium", quantity: sizes.medium.quantity },
      { size: "Large", quantity: sizes.large.quantity },
      { size: "XL", quantity: sizes.xl.quantity },
    ],
    frontImage,
    backImage,
    stockQuantity,
    usageTitle,
    steps,
  };

  return transformedData;
};

export default function AddModal({ onClose, product = {} }) {
  const stepKeys = ["step1", "step2", "step3"];
  const [currentProduct, setCurrentProduct] = useState({
    name: product.name || "",
    detail: product.detail || "",
    subsection: product.subDetail || "",
    description: product.description || "",
    price: product.price || 0,
    stock: product.stockQuantity || 0,
    sizes: {
      small: { selected: false, quantity: product.sizes?.[0]?.quantity || 0 },
      medium: { selected: false, quantity: product.sizes?.[1]?.quantity || 0 },
      large: { selected: false, quantity: product.sizes?.[2]?.quantity || 0 },
      xl: { selected: false, quantity: product.sizes?.[3]?.quantity || 0 },
    },
    frontImage: product.frontImage || null,
    backImage: product.backImage || null,
    usageTitle: product.usageTitle || "",
    steps: {
      step1: {
        title: product.steps?.step1?.title || "",
        description: product.steps?.step1?.description || "",
        image: product.steps?.step1?.image || null,
      },
      step2: {
        title: product.steps?.step2?.title || "",
        description: product.steps?.step2?.description || "",
        image: product.steps?.step2?.image || null,
      },
      step3: {
        title: product.steps?.step3?.title || "",
        description: product.steps?.step3?.description || "",
        image: product.steps?.step3?.image || null,
      },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const send = transformDataToSchema(currentProduct);

      if (!product._id) {
        const response = await axios.post("/products", send, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Product added successfully");
      } else {
        const response = await axios.put(`/products/${product._id}`, send, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Product updated successfully");
      }
    } catch (error) {
      console.error("Error adding/updating Product:", error);
      const message =
        error.response?.data?.error || "Failed to add/update product";
      console.log(message);
    }
  };

  const handleInputChange = (e, key, subKey = null) => {
    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;
    setCurrentProduct((prev) => ({
      ...prev,
      [key]: subKey ? { ...prev[key], [subKey]: value } : value,
    }));
  };

  const handleStepChange = (e, stepKey, key) => {
    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;
    setCurrentProduct((prev) => ({
      ...prev,
      steps: {
        ...prev.steps,
        [stepKey]: {
          ...prev.steps[stepKey],
          [key]: value,
        },
      },
    }));
  };

  return (
    <div className={styles.modaloverlay}>
      <form
        encType='multipart/form-data'
        className={styles.modalcontent}
        onSubmit={handleSubmit}>
        <span className={styles.closeicon} onClick={onClose}>
          &times;
        </span>
        <div className={styles.flexContainer}>
          {/* Product Information Section */}
          <div className={styles.column}>
            <h3 style={{ fontWeight: "bold" }}>Product Information</h3>
            <div className={styles.row}>
              <label>Name:</label>
              <input
                type='text'
                value={currentProduct.name}
                onChange={(e) => handleInputChange(e, "name")}
              />
            </div>
            <div className={styles.row}>
              <label>Detail:</label>
              <input
                type='text'
                value={currentProduct.detail}
                onChange={(e) => handleInputChange(e, "detail")}
              />
            </div>
            <div className={styles.row}>
              <label>Sub Section:</label>
              <input
                type='text'
                value={currentProduct.subsection}
                onChange={(e) => handleInputChange(e, "subsection")}
              />
            </div>
            <div className={styles.row}>
              <label>Description:</label>
              <input
                type='text'
                value={currentProduct.description}
                onChange={(e) => handleInputChange(e, "description")}
              />
            </div>
            <div className={styles.row}>
              <label>Price:</label>
              <input
                type='number'
                className={styles.counterInput}
                value={currentProduct.price}
                onChange={(e) => handleInputChange(e, "price")}
              />
              <label style={{ marginLeft: "10px" }}>Stock:</label>
              <input
                type='number'
                className={styles.counterInput}
                value={currentProduct.stock}
                onChange={(e) => handleInputChange(e, "stock")}
              />
            </div>
            <h4 style={{ fontWeight: "bold" }}>Sizes and Quantity</h4>
            <div className={styles.row}>
              {/* Sizes Column */}
              <div className={styles.column}>
                {["small", "medium", "large", "xl"].map((size) => (
                  <div key={size}>
                    <input
                      type='checkbox'
                      id={size}
                      value={size.charAt(0).toUpperCase() + size.slice(1)}
                      onChange={(e) =>
                        setCurrentProduct((prev) => ({
                          ...prev,
                          sizes: {
                            ...prev.sizes,
                            [size]: {
                              selected: e.target.checked,
                              quantity: prev.sizes[size].quantity,
                            },
                          },
                        }))
                      }
                    />
                    <label style={{ marginLeft: "10px" }} htmlFor={size}>
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </label>
                  </div>
                ))}
              </div>

              {/* Quantity Column */}
              <div className={styles.column}>
                {["small", "medium", "large", "xl"].map((size) => (
                  <div key={size}>
                    <label htmlFor={`${size}-quantity`}>Quantity:</label>
                    <input
                      type='number'
                      id={`${size}-quantity`}
                      disabled={!currentProduct.sizes[size].selected}
                      value={currentProduct.sizes[size].quantity}
                      onChange={(e) =>
                        setCurrentProduct((prev) => ({
                          ...prev,
                          sizes: {
                            ...prev.sizes,
                            [size]: {
                              ...prev.sizes[size],
                              quantity: Math.max(0, Number(e.target.value)),
                            },
                          },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.row}>
              <label>Front Image:</label>
              <input
                type='file'
                name='frontImage'
                id='frontImage'
                onChange={(e) => handleInputChange(e, "frontImage")}
              />
              {product.frontImage && (
                <img
                  className='size-1/3'
                  src={product.frontImage}
                  alt='Front'
                  crossOrigin='anonymous'
                />
              )}
            </div>
            <div className={styles.row}>
              <label>Back Image:</label>
              <input
                type='file'
                name='backImage'
                id='backImage'
                onChange={(e) => handleInputChange(e, "backImage")}
              />
              {product.backImage && (
                <img
                  className='size-1/3'
                  src={product.backImage}
                  alt='Front'
                  crossOrigin='anonymous'
                />
              )}
            </div>
          </div>

          {/* Usage Information Section */}
          <div className={styles.column}>
            <h3 style={{ fontWeight: "bold" }}>Usage Information</h3>
            <div className={styles.row}>
              <label>Usage Title:</label>
              <input
                type='text'
                value={currentProduct.usageTitle}
                onChange={(e) => handleInputChange(e, "usageTitle")}
              />
            </div>
            <h4 style={{ fontWeight: "bold" }}>Steps</h4>
            {stepKeys.map((stepKey, index) => (
              <div key={stepKey}>
                <h4>Step {index + 1}</h4>
                <div className={styles.row}>
                  <label>Step Title:</label>
                  <input
                    type='text'
                    value={currentProduct.steps[stepKey].title}
                    onChange={(e) => handleStepChange(e, stepKey, "title")}
                  />
                </div>
                <div className={styles.row}>
                  <label>Description:</label>
                  <input
                    type='text'
                    value={currentProduct.steps[stepKey].description}
                    onChange={(e) =>
                      handleStepChange(e, stepKey, "description")
                    }
                  />
                </div>
                <div className={styles.row}>
                  <label>Image:</label>
                  <input
                    name={`step${index + 1}Image`}
                    type='file'
                    onChange={(e) => handleStepChange(e, stepKey, "image")}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className={styles.submitButton} type='submit'>
          {product._id ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
