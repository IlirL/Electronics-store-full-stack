import React, { useState } from "react";
import { styled } from "@mui/system";
import {
  Button,
  TextField,
  Container,
  Typography,
  Paper,
  Box,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import electronicsStoreImage from "../images/electronicsStoreImage.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GlobalStyle = styled("div")`
  html,
  body,
  #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  background: url(${electronicsStoreImage}) no-repeat center center fixed;
  background-size: cover;
`;

const SignupContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
}));

const SignupForm = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: "450px",
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
}));

const SignupTitle = styled(Typography)(({ theme }) => ({
  whiteSpace: "nowrap",
  marginBottom: theme.spacing(2),
}));

const SignupTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  "& label.Mui-focused": {
    color: "#0073e6",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#0073e6",
    },
    "&:hover fieldset": {
      borderColor: "#005cbf",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#0073e6",
    },
  },
}));

const SignupButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  background: "#0073e6",
  color: "#fff",
  "&:hover": {
    background: "#005cbf",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValid = emailRegex.test(newEmail);
    setIsEmailValid(isValid);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    const isValid = passwordRegex.test(newPassword);
    setIsPasswordValid(isValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid || !isPasswordValid) {
      setOpenSnackbar(true);
      return;
    }
    const user = { fullName, email, password };

    console.log(user);

    try {
      const response = await fetch("http://localhost:5000/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      });
      if (response.status === 200) {
        alert("Succefsully Signed Up");
        navigate("/login");
      } else {
        alert("Could not sign up!");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    console.log("ILIRR");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <GlobalStyle>
      <SignupContainer>
        <SignupForm elevation={3}>
          <SignupTitle variant="h4">Create an Account</SignupTitle>
          <SignupTextField
            label="Full Name"
            variant="outlined"
            type="text"
            required
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <SignupTextField
            label="Email"
            variant="outlined"
            type="email"
            required
            fullWidth
            error={!isEmailValid}
            helperText={!isEmailValid ? "Invalid email address" : ""}
            value={email}
            onChange={handleEmailChange}
          />
          <SignupTextField
            label="Password"
            variant="outlined"
            type="password"
            required
            fullWidth
            error={!isPasswordValid}
            helperText={
              !isPasswordValid
                ? "Password must contain at least one uppercase letter, one lowercase letter, and one number."
                : ""
            }
            value={password}
            onChange={handlePasswordChange}
          />
          <SignupButton
            type="submit"
            variant="contained"
            fullWidth
            onClick={handleSubmit}
          >
            Sign Up
          </SignupButton>
          <Box textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Already have an account? <a href="/login">Log In</a>
            </Typography>
          </Box>
        </SignupForm>
      </SignupContainer>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          Invalid email address or password. Password must contain at least one
          uppercase letter, one lowercase letter, and one number.
        </Alert>
      </Snackbar>
    </GlobalStyle>
  );
};

export default Signup;
