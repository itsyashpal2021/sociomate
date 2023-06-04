import React from "react";
import "../css/animations.css";

export default function Spinner(props) {
  return (
    <svg
      className={"spinner " + props.className}
      viewBox="0 0 50 50"
      style={{ display: "none", ...props.style }}
      id={props.id}
    >
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
