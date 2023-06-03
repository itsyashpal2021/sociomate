import React, { useState } from "react";
import { Link } from "react-router-dom";

export function ForgotPassword() {
  const [email, setEmail] = useState(undefined);
  const [otp, setOtp] = useState(undefined);
  const [enteredOtp, setEnteredOtp] = useState(undefined);
  const [errorLabel, setErrorLabel] = useState(undefined);

  const sendOtp = () => {
    setEmail(document.getElementById("email").value);
    setOtp(1245);
    setEnteredOtp("");
  };

  const verifyOtp = () => {
    setEnteredOtp(undefined);
  };

  const changePassword = (e) => {
    e.preventDefault();
    setErrorLabel(undefined);
    const formValues = Object.fromEntries(
      new FormData(document.getElementsByTagName("form")[0])
    );
    if (formValues.newPassword !== formValues.confirmPassword) {
      setErrorLabel("passwords do not match.");
      return;
    }
    alert("password changed");
  };

  const focusToNextInput = (e) => {
    const target = e.target;
    const inputs = document.querySelectorAll(".otpInput");
    const currentIndex = [...inputs].findIndex((el) => target.isSameNode(el));
    if (e.keyCode >= 96 && e.keyCode <= 105) {
      //nums
      e.preventDefault();
      target.value = e.key;
      const targetIndex = currentIndex + 1;
      if (targetIndex !== inputs.length) inputs[targetIndex].focus();
      else {
        target.blur();
      }
    } else if (e.keyCode === 8) {
      // backspace
      e.preventDefault();
      target.value = "";
      const targetIndex = currentIndex - 1;
      if (targetIndex >= 0) inputs[targetIndex].focus();
    }
    let input = "";
    inputs.forEach((el) => {
      input = input.concat(el.value);
    });
    setEnteredOtp(input);
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
          <h1 className="m-0 text-info">youtix</h1>
          <p
            className="m-0"
            style={{
              color: "rgb(182 182 182)",
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
        Introducing a simple youtube toolbox
      </h3>

      <form
        className="align-items-center col-10 col-lg-7 col-md-8 col-lg-7 col-xl-5 d-flex flex-column m-auto my-3 p-4 rounded-5"
        style={{
          border: "2px solid #F8F1F1",
          color: "#E8AA42",
          backgroundColor: "#05323bad",
        }}
      >
        {otp ? (
          enteredOtp !== undefined ? (
            <>
              <p className="text-white fw-bold">Enter otp sent to {email}</p>
              <div className="my-2 w-100">
                <div className="d-flex justify-content-center">
                  <input
                    type="number"
                    className="form-control-lg fs-4 me-1 otpInput"
                    onKeyDown={focusToNextInput}
                  />
                  <input
                    type="number"
                    className="form-control-lg fs-4 me-1 otpInput"
                    onKeyDown={focusToNextInput}
                  />
                  <input
                    type="number"
                    className="form-control-lg fs-4 me-1 otpInput"
                    onKeyDown={focusToNextInput}
                  />
                  <input
                    type="number"
                    className="form-control-lg fs-4 otpInput"
                    onKeyDown={focusToNextInput}
                  />
                </div>
                <button
                  className="btn btn-lg btn-primary my-2 w-100"
                  disabled={enteredOtp.length !== 4}
                  onClick={verifyOtp}
                >
                  Verify
                </button>
              </div>
            </>
          ) : (
            <>
              <label
                htmlFor="newPassword"
                className="form-label fw-bold mt-1 me-auto"
              >
                New Password
              </label>
              <input
                type="password"
                className="form-control-lg fs-5"
                id="newPassword"
                name="newPassword"
                required
              />
              <label
                htmlFor="confirmPassword"
                className="form-label fw-bold mt-2 me-auto"
              >
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control-lg fs-5"
                id="confirmPassword"
                name="confirmPassword"
                required
              />

              <div className="me-auto my-2">
                <input
                  className="form-check-input my-1 ms-md-0 ms-sm-2 ms-0"
                  type="checkbox"
                  id="showPassword"
                  onChange={() => {
                    if (
                      document.getElementById("newPassword").type !== "text"
                    ) {
                      document.getElementById("newPassword").type = "text";
                      document.getElementById("confirmPassword").type = "text";
                    } else {
                      document.getElementById("newPassword").type = "password";
                      document.getElementById("confirmPassword").type =
                        "password";
                    }
                  }}
                />
                <label
                  htmlFor="showPassword"
                  className="form-check-label ms-2 fw-bold user-select-none"
                >
                  show passwords
                </label>
              </div>

              <button
                className="btn btn-lg btn-primary my-2 w-100"
                onClick={changePassword}
              >
                Change Password
              </button>
            </>
          )
        ) : (
          <>
            <p className="text-white fw-bold">
              ***Enter your registered email id***
            </p>
            <div className="my-2 w-100">
              <label htmlFor="email" className="form-label fw-bold">
                Email
              </label>
              <input
                type="email"
                className="form-control-lg fs-5"
                id="email"
                name="email"
                required
              />
              <button
                className="btn btn-lg btn-primary my-2 w-100"
                onClick={sendOtp}
              >
                Send OTP
              </button>
            </div>
          </>
        )}

        {errorLabel ? <p className="errorLabel">{errorLabel}</p> : <></>}

        <Link
          to={"/login"}
          className="ms-auto"
          style={{ color: "rgb(73, 197, 182)" }}
        >
          <i className="fa-solid fa-arrow-left me-1" />
          Back to login
        </Link>
      </form>
    </div>
  );
}
