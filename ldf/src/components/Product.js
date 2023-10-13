import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { selectUser } from "../redux/authSlice";

function Product() {
  const user = useSelector(selectUser);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    quantity: 0,
  });
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      token: token,
    },
  };

  const [products, setProducts] = useState([]);
  console.log(products);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = () => {
    axios
      .post(
        "http://localhost:5000/api/product",
        { ...newProduct, quantity: parseInt(newProduct?.quantity) },
        config
      )
      .then((response) => {
        console.log("Product added:", response.data);

        handleCloseModal();
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  const fetchProducts = () => {
    axios
      .get("http://localhost:5000/api/product", config)
      .then((response) => {
        console.log("responseeeeeeeeee", response);
        setProducts(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const linkStyles = {
    textDecoration: "none",
  };

  return (
    <div>
      {user?.role === "ADMIN" || user?.role === "EMPLOYEE" ? (
        <Button
          variant="contained"
          color="success"
          onClick={handleOpenModal}
          style={{ float: "right", margin: "10px" }}
        >
          Create New Product
        </Button>
      ) : null}

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={newProduct.name}
            onChange={handleFieldChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={newProduct.description}
            onChange={handleFieldChange}
            fullWidth
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={newProduct.quantity}
            onChange={handleFieldChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddProduct} color="primary">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h4">Product List</Typography>
      <List>
        {products?.map((product) => (
          <Paper
            elevation={3}
            key={product.id}
            style={{ padding: "16px", margin: "10px" }}
          >
            <ListItem>
              {user?.role === "USER" ? (
                <ListItemText
                  primary={product.name}
                  secondary={product.description}
                />
              ) : (
                <Link to={`/product/${product.id}`} style={linkStyles}>
                  <ListItemText
                    primary={product.name}
                    secondary={product.description}
                  />
                </Link>
              )}
            </ListItem>
          </Paper>
        ))}
      </List>
    </div>
  );
}

export default Product;
