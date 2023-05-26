import React, { useState } from "react";
import "../css/form.css";
import "../css/animations.css";
import { Link } from "react-router-dom";
import { postToNodeServer } from "../utils";

export function Register() {
  const [errorLabel, setErrorLabel] = useState(undefined);
  const onRegister = async (e) => {
    e.preventDefault();
    setErrorLabel(undefined);
    const formValues = Object.fromEntries(new FormData(e.target));
    if (formValues.password !== formValues.confirmPassword) {
      setErrorLabel("Passwords do not match.");
      return;
    }
    const res = await postToNodeServer("/register", formValues);
    if (res.status === 400) setErrorLabel(res.message);
  };
  return (
    <div className="container-fluid row">
      <div className="col-6 flex-wrap m-auto d-flex align-items-center justify-content-center px-4 py-3">
        <img
          src={require("../logo.png")}
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
        onSubmit={onRegister}
        className="col-xxl-8 col-lg-9 col-md-11 col-sm-7 col-10 m-auto p-4 my-3 d-flex flex-column align-items-center rounded-5"
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
          Register New User
        </h2>

        <div className="d-flex justify-content-around flex-wrap w-100">
          <div className="my-2">
            <label htmlFor="firstName" className="form-label fw-bold">
              First Name
            </label>
            <input
              type="text"
              className="form-control-lg fs-5"
              id="firstName"
              name="firstName"
              required
            />
          </div>
          <div className="my-2">
            <label htmlFor="lastName" className="form-label fw-bold">
              Last Name
            </label>
            <input
              type="text"
              className="form-control-lg fs-5"
              id="lastName"
              name="lastName"
              required
            />
          </div>
        </div>

        <div className="d-flex justify-content-around flex-wrap w-100">
          <div className="my-2">
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
          <div className="my-2">
            <label htmlFor="email" className="form-label fw-bold">
              Email ID
            </label>
            <input
              type="email"
              className="form-control-lg fs-5"
              id="email"
              name="email"
              required
            />
          </div>
        </div>

        <div className="d-flex justify-content-around flex-wrap w-100">
          <div className="my-2">
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

          <div className="my-2">
            <label htmlFor="confirmPassword" className="form-label fw-bold">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control-lg my-1 fs-5"
              id="confirmPassword"
              name="confirmPassword"
              required
            />
          </div>
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
                document.getElementById("confirmPassword").type = "text";
              } else {
                document.getElementById("password").type = "password";
                document.getElementById("confirmPassword").type = "password";
              }
            }}
          />
          <label
            htmlFor="showPassword"
            className="form-check-label ms-2 fw-bold user-select-none"
          >
            show passwords
          </label>

          <Link to={"/login"} className="ms-md-auto ms-sm-2 ms-0 my-1">
            Login to an existing account
          </Link>
        </div>
        <button type="submit" className="btn btn-lg btn-success w-100 mt-1">
          Register
        </button>
      </form>
    </div>
  );
}
