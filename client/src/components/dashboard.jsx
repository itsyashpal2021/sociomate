import React, { useEffect, useState } from "react";
import { postToNodeServer } from "../utils";
import { useNavigate } from "react-router-dom";
import "../css/dashboard.css";
import Accounts from "./accounts";

export default function Dashboard() {
  const [sessionActive, setSessionActive] = useState(false);
  const [navlink, setNavlink] = useState("Home");
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const res = await postToNodeServer("/checkSession", {});
      if (res.sessionActive === false) navigate("/login");
      else setSessionActive(res.sessionActive);
    };
    checkSession();
  }, [navigate]);

  const signout = async () => {
    const res = await postToNodeServer("/signout", {});
    if (res.status === 200) navigate("/login");
  };

  const makeActive = (e) => {
    const currentActive = document.getElementsByClassName("active")[0];
    currentActive.classList.remove("active");
    e.target.classList.add("active");
    setNavlink(e.target.innerHTML);
  };

  const getDashboardContent = () => {
    switch (navlink) {
      case "Home":
        return <h1>This is Home</h1>;

      case "My Profile":
        return <h1>This is Profile</h1>;

      case "Manage Accounts":
        return <Accounts />;

      default:
        return <></>;
    }
  };

  return sessionActive ? (
    <div className="w-100 h-100 align-self-start">
      {/* navbar  */}
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "rgba(0,0,0,0.90)" }}
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon">
              <i
                className="fas fa-bars"
                style={{ color: "#fff", fontSize: "28px" }}
              />
            </span>
          </button>

          <div className="d-flex align-items-center navbar-brand mx-auto mx-lg-0 user-select-none">
            <img
              src={require("../Images/logo.png")}
              alt="sm"
              style={{ height: "45px" }}
              className="rounded"
            />
            <span className="text-warning fs-4 ms-2 fw-bold">sociomate</span>
          </div>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <span
                  className="nav-link active mx-lg-2"
                  aria-current="page"
                  onClick={makeActive}
                >
                  Home
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link mx-lg-2" onClick={makeActive}>
                  Manage Accounts
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link mx-lg-2" onClick={makeActive}>
                  My Profile
                </span>
              </li>
            </ul>
            <button
              className="btn btn-outline-danger fw-bold"
              onClick={signout}
            >
              sign out
            </button>
          </div>
        </div>
      </nav>

      {getDashboardContent()}
    </div>
  ) : (
    <h2 className="text-white fw-bold">Loading</h2>
  );
}
