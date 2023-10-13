import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormHelperText,
  Select,
  MenuItem,
} from "@mui/material";
import styled from "styled-components";

const StyledPaper = styled(Paper)`
  margin-bottom: 20px;
  padding: 20px;
`;

const UserTable = styled(Table)`
  width: 100%;
`;

const UserTableRow = styled(TableRow)`
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const NoUnderlineLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const AddUserButton = styled(Button)`
  background-color: green;
  color: white;
  margin-top: 2%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

function User() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    role: "USER",
    password: "",
  });

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setNewUser({ ...newUser, email: newEmail });

    // Check if the new email matches the regex pattern
    const isEmailValid = EmailRegex.test(newEmail);
    setEmailError(!isEmailValid);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewUser({ ...newUser, password: newPassword });

    // Check if the new password matches the regex pattern
    const isPasswordValid = PasswordRegex.test(newPassword);
    setPasswordError(!isPasswordValid);
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setNewUser({ ...newUser, role: selectedRole });
  };

  // const handleAddUser = () => {
  //   // Validate email and password
  //   const isEmailValid = EmailRegex.test(newUser.email);
  //   const isPasswordValid = PasswordRegex.test(newUser.password);

  //   setEmailError(!isEmailValid);
  //   setPasswordError(!isPasswordValid);

  //   if (isEmailValid && isPasswordValid) {
  //     // Add your code here to send a request to the server and add the new user
  //     // You can use axios.post or any other suitable method

  //     // After successfully adding the user, close the modal and optionally refresh the user list
  //     setModalOpen(false);
  //   }
  // };
  const handleAddUser = () => {
    const isEmailValid = EmailRegex.test(newUser.email);
    const isPasswordValid = PasswordRegex.test(newUser.password);

    setEmailError(!isEmailValid);
    setPasswordError(!isPasswordValid);

    if (isEmailValid && isPasswordValid && newUser.fullName && newUser.role) {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          token: token,
        },
      };

      const userToAdd = {
        email: newUser.email,
        password: newUser.password,
        fullName: newUser.fullName,
        role: newUser.role,
      };

      axios
        .post("http://localhost:5000/api/user", userToAdd, config)
        .then((response) => {
          console.log("User added:", response.data);
          fetchUserData();
          setModalOpen(false);
        })
        .catch((error) => {
          console.error("Error adding user:", error);
        });
    }
  };

  const fetchUserData = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token is missing in localStorage.");
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        token: `${token}`,
      },
    };

    axios
      .get("http://localhost:5000/api/user", config)
      .then((response) => {
        setUserData(response.data.data.rows);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data: ", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <div>
      <ButtonContainer>
        <AddUserButton variant="contained" onClick={handleOpenModal}>
          Add User
        </AddUserButton>
      </ButtonContainer>
      {userData.length > 0 && (
        <StyledPaper>
          <UserTable>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData.map((user) => (
                <UserTableRow key={user.id}>
                  <TableCell>
                    <Link to={`/admin/user/${user.id}`}>{user.fullName}</Link>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </UserTableRow>
              ))}
            </TableBody>
          </UserTable>
        </StyledPaper>
      )}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent style={{ padding: "16px" }}>
          <TextField
            label="Full Name"
            fullWidth
            value={newUser.fullName}
            onChange={(e) =>
              setNewUser({ ...newUser, fullName: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            value={newUser.email}
            onChange={handleEmailChange}
            error={emailError}
          />
          {emailError && (
            <FormHelperText error>Email address is not valid.</FormHelperText>
          )}
          <Select
            label="Role"
            fullWidth
            value={newUser.role}
            onChange={handleRoleChange}
          >
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="EMPLOYEE">Employee</MenuItem>
          </Select>
          <TextField
            label="Password"
            fullWidth
            type="password"
            value={newUser.password}
            onChange={handlePasswordChange}
            error={passwordError}
          />
          {passwordError && (
            <FormHelperText error>
              Password must contain at least one uppercase letter, one lowercase
              letter, and one number.
            </FormHelperText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddUser} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default User;
