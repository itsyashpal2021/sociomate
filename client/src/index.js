import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Register } from "./components/register";
import { Login } from "./components/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

const root = document.getElementById("root");
root.style.minHeight = window.innerHeight + "px";
window.addEventListener("resize", () => {
  root.style.minHeight = window.innerHeight + "px";
});

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    {/* // <Provider> */}
    <RouterProvider router={router} />
    {/* // </Provider> */}
  </React.StrictMode>
);
