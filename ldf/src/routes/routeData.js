import Dashboard from "../components/admin/Dashboard";
import SingleUser from "../components/admin/SingleUser";
import User from "../components/admin/User";
import Login from "../components/Login";
import Product from "../components/Product";
import SignUp from "../components/SignUp";
import SingleProduct from "../components/SingleProduct";

export const routes = [
  {
    path: "/admin/dashboard",
    element: <Dashboard />,
    roles: ["ADMIN"],
    show: true,
    name: "Dashboard",
  },
  {
    path: "/admin/user",
    element: <User />,
    roles: ["ADMIN"],
    show: true,
    name: "Users",
  },
  {
    path: "/products",
    element: <Product />,
    roles: ["ADMIN", "EMPLOYEE", "USER"],
    show: true,
    name: "Products",
  },

  {
    path: "/product/:productId",
    element: <SingleProduct />,
    roles: ["ADMIN", "EMPLOYEE"],
    show: false,
    name: "SingleProduct",
  },

  { path: "/login", element: <Login />, roles: [], name: "Login" },
  { path: "/signup", element: <SignUp />, roles: [], name: "Login" },
  {
    path: "/admin/user/:userId",
    element: <SingleUser />,
    roles: ["ADMIN"],
    show: false,
  },
];

export const privateRoutes = [
  { path: "/admin/dashboard", element: <Dashboard />, roles: ["ADMIN"] },
  { path: "/admin/user", element: <User />, roles: ["ADMIN"] },
  {
    path: "/products",
    element: <Product />,
    roles: ["ADMIN", "EMPLOYEE", "USER"],
  },
];
