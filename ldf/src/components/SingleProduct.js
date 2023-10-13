import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

function SingleProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const config = {
      headers: {
        token: token,
      },
    };

    axios
      .get(`http://localhost:5000/api/product/${productId}`, config)
      .then((response) => {
        setProduct(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching product details: ", error);
      });
  }, [productId]);

  const handleDeleteProduct = () => {
    setConfirmationModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const config = {
      headers: {
        token: token,
      },
    };
    axios
      .delete(`http://localhost:5000/api/product/${productId}`, config)
      .then((response) => {
        console.log("Product deleted:", response.data);
        setConfirmationModalOpen(false);
        navigate("/products");
      })
      .catch((error) => {
        console.error("Error deleting product: ", error);
      });
  };

  const handleCancelDelete = () => {
    setConfirmationModalOpen(false);
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <div>
      <Paper elevation={3} style={{ padding: "16px", margin: "20px" }}>
        <Typography variant="h4">Product Details</Typography>
        <List>
          <ListItem>
            <ListItemText primary="Name" secondary={product?.name} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Description"
              secondary={product?.description}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Quantity" secondary={product?.quantity} />
          </ListItem>
        </List>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteProduct}
          >
            Delete Product
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "10px" }}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={{ marginLeft: "10px" }}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </Paper>

      <Dialog
        open={isConfirmationModalOpen}
        onClose={handleCancelDelete}
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SingleProduct;
