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

function SingleUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const config = {
      headers: {
        token: token,
      },
    };

    axios
      .get(`http://localhost:5000/api/user/${userId}`, config)
      .then((response) => {
        setUser(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching user details: ", error);
      });
  }, [userId]);

  const handleDeleteUser = () => {
    setConfirmationModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const config = {
      headers: {
        token: token,
      },
    };
    axios
      .delete(`http://localhost:5000/api/user/${userId}`, config)
      .then((response) => {
        console.log("User deleted:", response.data);
        setConfirmationModalOpen(false);
        navigate("/admin/user");
      })
      .catch((error) => {
        console.error("Error deleting user: ", error);
      });
  };

  const handleCancelDelete = () => {
    setConfirmationModalOpen(false);
  };

  const handleCancel = () => {
    navigate("/admin/user");
  };

  return (
    <div>
      <Paper elevation={3} style={{ padding: "16px", margin: "20px" }}>
        <Typography variant="h4">User Details</Typography>
        <List>
          <ListItem>
            <ListItemText primary="Full Name" secondary={user?.fullName} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Role" secondary={user?.role} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" secondary={user?.email} />
          </ListItem>
        </List>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="error" onClick={handleDeleteUser}>
            Delete User
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
          Are you sure you want to delete this user?
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

export default SingleUser;
