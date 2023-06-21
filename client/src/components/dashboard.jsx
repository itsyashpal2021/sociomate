import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../css/dashboard.css";
import "../css/form.css";

export default function Dashboard() {
  //yt downloader states
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState(undefined);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  //channel states
  const [channelSearchText, setChannelSearchText] = useState("");
  const [channelSearchResult, setChannelSearchResult] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const activeNavlink = document.getElementsByClassName("active")[0];
    if (activeNavlink) activeNavlink.classList.remove("active");

    const navLink = document.getElementById(path.split("/")[1]);
    if (navLink) {
      navLink.classList.add("active");
      document
        .getElementById("navbarSupportedContent")
        .classList.remove("show");
    }
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <div className="w-100 h-100 align-self-start">
      {/* navbar  */}
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{
          backgroundColor: "rgba(0,0,0,0.90)",
        }}
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
            <span className="text-warning fs-4 ms-2 fw-bold">youtix</span>
          </div>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  to={"/ytDownloader"}
                  className="nav-link mx-lg-2"
                  id="ytDownloader"
                >
                  Yt-Downloader
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={"/channels"}
                  className="nav-link mx-lg-2"
                  id="channels"
                >
                  Channel Stats
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/about"} className="nav-link mx-lg-2" id="about">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet
        context={{
          windowWidth,
          searchText,
          setSearchText,
          searchResult,
          setSearchResult,
          channelSearchText,
          setChannelSearchText,
          channelSearchResult,
          setChannelSearchResult,
        }}
      />
    </div>
  );
}
