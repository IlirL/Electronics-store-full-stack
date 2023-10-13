import React, { useEffect } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useSelector, useDispatch } from "react-redux";
import {
  setUser,
  logout,
  selectIsAuthenticated,
  selectUser,
} from "./redux/authSlice";
import Navigation from "./components/Navigation";

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/api/auth/token", {
        method: "POST",
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          if (response?.data?.user) {
            console.log("DATAAAAAA", response);

            dispatch(setUser(response?.data));
          } else {
            dispatch(logout());
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          dispatch(logout());
        });
    }
  }, []);

  return (
    <Router>
      {user ? <Navigation /> : <></>}
      <AppRoutes />
    </Router>
  );
}

export default App;
