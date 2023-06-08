import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import Dashboard from "./components/dashboard";
import About from "./components/about";
import YtDownloader from "./components/ytDownloader";
import Channels from "./components/channels";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <ErrorBoundry />,
    children: [
      {
        path: "/",
        element: <Navigate to="/ytDownloader" />,
      },
      {
        path: "/ytDownloader",
        element: <YtDownloader />,
      },
      {
        path: "/channels",
        element: <Channels />,
      },
      {
        path: "/about",
        element: <About />,
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
    <RouterProvider router={router} />
  </React.StrictMode>
);
