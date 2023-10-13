import React, { useState } from "react";
import { styled } from "@mui/system";
import {
  Button,
  TextField,
  Container,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import electronicsStoreImage from "../images/electronicsStoreImage.jpg";
import { setUser } from "../redux/authSlice";
import { useDispatch } from "react-redux";

const GlobalStyle = styled("div")`
  html,
  body,
  #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden; // Prevent body overflow
  }
  background: url(${electronicsStoreImage}) no-repeat center center fixed;
  background-size: cover;
`;

const LoginContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
}));

const LoginForm = styled(Paper)(({ theme }) => ({
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

const LoginTitle = styled(Typography)(({ theme }) => ({
  whiteSpace: "nowrap",
  marginBottom: theme.spacing(2),
}));

const LoginTextField = styled(TextField)(({ theme }) => ({
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

const LoginButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  background: "#0073e6",
  color: "#fff",
  "&:hover": {
    background: "#005cbf",
  },
}));

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { email, password };

    console.log(user);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      });
      if (response.status === 200) {
        const data = (await response.json()).data;

        console.log(data);
        dispatch(setUser(data));
      } else {
        alert("Could not Log in!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <GlobalStyle>
      <LoginContainer>
        <LoginForm elevation={3}>
          <LoginTitle variant="h4">Welcome to Electronics Store</LoginTitle>
          <Typography variant="subtitle1" color="textSecondary">
            Log in to access your account
          </Typography>
          <form onSubmit={handleSubmit}>
            <LoginTextField
              label="Email"
              variant="outlined"
              type="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <LoginTextField
              label="Password"
              variant="outlined"
              type="password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <LoginButton type="submit" variant="contained" fullWidth>
              Log In
            </LoginButton>
          </form>
          <Box textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Don't have an account? <a href="/signup">Sign Up</a>
            </Typography>
          </Box>
        </LoginForm>
      </LoginContainer>
    </GlobalStyle>
  );
};

export default Login;
