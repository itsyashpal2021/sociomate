import React, { useEffect, useState } from "react";
import { postToNodeServer } from "../utils";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import "../css/dashboard.css";

export default function Dashboard() {
  const [sessionActive, setSessionActive] = useState(false);
  const [userData, setUserData] = useState(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getUserdata = async () => {
      const res = await postToNodeServer("/userData", {});
      if (res.status === 200) {
        console.log(res.userData);
        setUserData({ ...res.userData });
      }
    };
    const checkSession = async () => {
      const res = await postToNodeServer("/checkSession", {});
      if (res.sessionActive === false) navigate("/login");
      else {
        getUserdata();
        setSessionActive(res.sessionActive);
      }
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    if (!sessionActive) return;
    [...document.getElementsByClassName("active")].forEach((el) => {
      el.classList.remove("active");
    });
    const path = location.pathname;
    const navLink = document.getElementById(path.split("/dashboard/")[1]);
    if (navLink) navLink.classList.add("active");
  }, [location.pathname, sessionActive]);

  const signout = async () => {
    const res = await postToNodeServer("/signout", {});
    if (res.status === 200) navigate("/login");
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
                <Link
                  to={"/dashboard/home"}
                  className="nav-link mx-lg-2"
                  id="home"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={"/dashboard/accounts"}
                  className="nav-link mx-lg-2"
                  id="accounts"
                >
                  Manage Accounts
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={"/dashboard/profile"}
                  className="nav-link mx-lg-2"
                  id="profile"
                >
                  My Profile
                </Link>
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
      <Outlet />
    </div>
  ) : (
    <h2 className="text-white fw-bold">Loading</h2>
  );
}
