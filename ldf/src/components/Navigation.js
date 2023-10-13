import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { routes } from "../routes/routeData";
import { logout } from "../redux/authSlice";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const useStyles = {
  title: {
    flexGrow: 1,
  },
  link: {
    marginRight: 10,
    textDecoration: "none",
  },
};

function Navigation() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        {routes.map((route, index) => {
          if (user && route.roles.includes(user.role) && route.show) {
            return (
              <Button
                key={index}
                color="inherit"
                component={Link}
                to={route.path}
                style={useStyles.link}
              >
                {route.name}
              </Button>
            );
          }
          return <></>;
        })}
        <div style={{ flexGrow: 1 }}></div>

        {user && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </StyledAppBar>
  );
}

export default Navigation;
