import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../components/Modals/Product";
import Alert from "../components/Alerts/Alert";
import Stack from "@mui/material/Stack";
import styles from "./style.module.css";

export default function AddProducts() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/products");

        if (response.data && response.data.length > 0) {
          setProducts(response.data);
        } else {
          alert("No products found");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/products/${productToDelete._id}`);
      setProducts(products.filter((p) => p._id !== productToDelete._id));
      setShowDeleteAlert(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <>
      <div className={styles.manageItems}>
        <div className={styles.top}>
          <h1>Manage Products</h1>
          <button onClick={() => setShowAddModal(true)}>Add Product</button>
        </div>
        <div className={styles.products}>
          <div className={styles.productgrid}>
            <div className={`${styles.header} ${styles.productno}`}>
              Product No.
            </div>
            <div className={`${styles.header} ${styles.productname}`}>
              Product Name
            </div>
            <div className={`${styles.header} ${styles.productprice}`}>
              Price
            </div>
            <div className={`${styles.header} ${styles.productstatus}`}>
              Status
            </div>
            <div className={`${styles.header} ${styles.productoperations}`}>
              Operations
            </div>

            {products.map((product, index) => (
              <React.Fragment key={product._id}>
                <div
                  className={`${styles.productno} ${styles.productdescription}`}>
                  {index + 1}
                  <Stack spacing={2} direction='row'>
                    <img
                      src={product.frontImage}
                      alt={product.name}
                      crossOrigin='anonymous'
                    />
                    <img
                      src={product.backImage}
                      alt={product.name}
                      crossOrigin='anonymous'
                    />
                  </Stack>
                </div>
                <div
                  className={`${styles.productname} ${styles.productdescription}`}>
                  {product.name}
                </div>
                <div
                  className={`${styles.productprice} ${styles.productdescription}`}>
                  {product.price}$
                </div>
                <div
                  className={`${styles.productstatus} ${
                    styles.productdescription
                  } 
                  ${
                    product.stockQuantity === 0
                      ? styles.outofstock
                      : styles.instock
                  }`}>
                  {product.stockQuantity === 0 ? "Out of Stock" : "In Stock"}
                </div>
                <div
                  className={`${styles.productoperations} ${styles.productdescription}`}>
                  <button
                    className={styles.updatebtn}
                    onClick={() => handleUpdateClick(product)}>
                    Update
                  </button>
                  <button
                    className={styles.deletebtn}
                    onClick={() => handleDeleteClick(product)}>
                    Delete
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Modals for updating and adding products */}

        {showAddModal && (
          <Modal
            show={showAddModal}
            onClose={() => setShowAddModal(false)}
            product={{}}
          />
        )}

        {showUpdateModal && (
          <Modal
            show={showUpdateModal}
            onClose={() => setShowUpdateModal(false)}
            product={selectedProduct}
          />
        )}

        {showDeleteAlert && (
          <Alert
            productName={productToDelete.name}
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteAlert(false)}
          />
        )}
      </div>
    </>
  );
}
