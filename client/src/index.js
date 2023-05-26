import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>path is /</h1>,
  },
  {
    path: "/login",
    element: <h1>This is login</h1>,
  },
]);

const root = document.getElementById("root");
root.style.height = window.innerHeight + "px";
window.addEventListener("resize", () => {
  root.style.height = window.innerHeight + "px";
});

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    {/* // <Provider> */}
    <RouterProvider router={router} />
    {/* // </Provider> */}
  </React.StrictMode>
);
