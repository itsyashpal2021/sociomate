import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { Register } from "./components/register";
import { Login } from "./components/login";
import { ForgotPassword } from "./components/forgotPassword";
import Dashboard from "./components/dashboard";
import Accounts from "./components/accounts";
import { Provider } from "react-redux";
import store from "./store.js";
import Home from "./components/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/dashboard/home"} />,
    errorElement: <ErrorBoundry />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "/dashboard/",
        element: <Navigate to="/dashboard/home" />,
      },
      {
        path: "/dashboard/home",
        element: <Home />,
      },
      {
        path: "/dashboard/accounts",
        element: <Accounts />,
      },
      {
        path: "/dashboard/profile",
        element: <h1>This is profile</h1>,
      },
      {
        path: "/dashboard/about",
        element: <h1>This is about</h1>,
      },
    ],
  },
]);

function ErrorBoundry() {
  let error = useRouteError();
  console.error(error);
  return (
    <div className="d-flex align-items-center bg-white rounded p-4 flex-wrap justify-content-center">
      <img
        src={require("./Images/404-error.png")}
        alt="404"
        className="rounded"
        style={{ maxWidth: "100%" }}
      />
      <h2 className="text-bold text-warning text-center">Page Not Found.</h2>
    </div>
  );
}

const root = document.getElementById("root");
root.style.minHeight = window.innerHeight + "px";
window.addEventListener("resize", () => {
  root.style.minHeight = window.innerHeight + "px";
});

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
