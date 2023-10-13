import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { routes } from "./routeData";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/authSlice";

const AppRoutes = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  console.log("filteredRoutes", filteredRoutes);
  useEffect(() => {
    // Check if the URL is '/' and no user is logged in
    if (!user) {
      setFilteredRoutes(routes?.filter((route) => route?.roles?.length === 0));
    }
    if (user) {
      setFilteredRoutes(
        routes?.filter((route) => route?.roles?.includes(user.role))
      );
      if (user.role === "ADMIN") navigate("/admin/dashboard");
      if (user.role === "EMPLOYEE" || "USER") navigate("/products");
    }
    if (location.pathname === "/" && !user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <Routes>
      {filteredRoutes?.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default AppRoutes;
