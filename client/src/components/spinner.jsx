import React from "react";
import "../css/animations.css";

export default function Spinner() {
  return (
    <svg className="spinner" viewBox="0 0 50 50" style={{display:'none'}}>
      <circle
        className="path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
      ></circle>
    </svg>
  );
}
