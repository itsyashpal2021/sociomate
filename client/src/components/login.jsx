import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postToNodeServer } from "../utils";

export function Login() {
  const [errorLabel, setErrorLabel] = useState(undefined);
  const navigate = useNavigate();

  const onLogin = async (e) => {
    e.preventDefault();
    const formValues = Object.fromEntries(new FormData(e.target));
    const res = await postToNodeServer("/login", formValues);
    if (res.status === 401) setErrorLabel("** Invalid Login **");
    else if (res.status === 200) navigate("/dashboard/home");
    else setErrorLabel(res.message);
  };

  return (
    <div className="container-fluid row">
      <div className="col-6 flex-wrap m-auto d-flex align-items-center justify-content-center px-4 py-3">
        <img
          src={require("../Images/logo.png")}
          alt="logo.png"
          style={{ maxHeight: "80px" }}
          className="me-3"
        />
        <div className="text-center">
          <h1 className="m-0" style={{ color: "#0F0" }}>
            Sociomate
          </h1>
          <p
            className="m-0"
            style={{
              color: "#8a936a",
              whiteSpace: "nowrap",
              animationName: "typing",
              animationDuration: "4s",
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
              animationDirection: "alternate",
              overflow: "hidden",
            }}
          >
            Simplify, connect, and thrive.
          </p>
        </div>
      </div>
      <h3 className="my-1 text-center" style={{ color: "#e1b579" }}>
        Introducing a unified social media dashboard
      </h3>
      <form
        onSubmit={onLogin}
        className="align-items-center col-10 col-lg-7 col-md-8 col-lg-7 col-xl-5 d-flex flex-column m-auto my-3 p-4 rounded-5"
        style={{
          border: "2px solid #F8F1F1",
          color: "#E8AA42",
          backgroundColor: "#05323bad",
        }}
      >
        <h2
          className="user-select-none text-decoration-underline text-center mb-3"
          style={{ color: "#49c5b6" }}
        >
          Login to your account
        </h2>
        <div className="my-2 w-100">
          <label htmlFor="username" className="form-label fw-bold">
            Username
          </label>
          <input
            type="text"
            className="form-control-lg fs-5"
            id="username"
            name="username"
            required
          />
        </div>
        <div className="my-2 w-100">
          <label htmlFor="password" className="form-label fw-bold">
            Password
          </label>
          <input
            type="password"
            className="form-control-lg my-1 fs-5"
            id="password"
            name="password"
            required
          />
        </div>
        {errorLabel ? <p className="errorLabel">{errorLabel}</p> : <></>}

        <div className="d-flex align-items-center flex-wrap px-2 w-100">
          <input
            className="form-check-input my-1 ms-md-0 ms-sm-2 ms-0"
            type="checkbox"
            id="showPassword"
            onChange={() => {
              if (document.getElementById("password").type !== "text") {
                document.getElementById("password").type = "text";
              } else {
                document.getElementById("password").type = "password";
              }
            }}
          />
          <label
            htmlFor="showPassword"
            className="form-check-label ms-2 fw-bold user-select-none"
          >
            show password
          </label>

          <Link to={"/register"} className="ms-sm-auto ms-2 my-1">
            Register new user
          </Link>
        </div>
        <Link
          to={"/forgotPassword"}
          className="my-2 ms-1 me-auto fw-bold text-danger"
        >
          Forgot Password?
        </Link>
        <button type="submit" className="btn btn-lg btn-primary w-100 mt-1">
          Login
        </button>
      </form>
    </div>
  );
}
