import React from "react";

function CustomDropdown(props) {
  const selectedOption = props.selectedOption
    ? props.options[props.selectedOption]
    : props.options[0];

  return (
    <div
      id={props.id}
      className="user-select-none"
      data-value={selectedOption.value} //custom attribute
      style={{ width: "max-content", cursor: "context-menu" }}
    >
      <div
        className="p-2 rounded border border-2 border-white text-white d-flex align-items-center w-100"
        onClick={() => {
          const optionDiv = document
            .getElementById(props.id)
            .querySelector(".dropdownOptions");

          optionDiv.style.visibility === "hidden"
            ? (optionDiv.style.visibility = "visible")
            : (optionDiv.style.visibility = "hidden");
        }}
      >
        <span className="me-2">{selectedOption.label}</span>
        <i className="fa fa-caret-down fa-solid ms-auto" />
      </div>

      {/* options */}
      <div
        className="dropdownOptions text-white d-flex flex-column border border-2 rounded my-1 w-100"
        style={{ visibility: "hidden" }}
      >
        {props.options.map((option) => {
          return (
            <span
              className="p-2 text-center rounded"
              key={option.value}
              onClick={() => {
                const parentDiv = document.getElementById(props.id);
                parentDiv.querySelector("span").innerHTML = option.label;
                parentDiv.dataset.value = option.value;
                if (props.onValueChange) props.onValueChange(option.value);
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = props.optionHoverColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "inherit";
              }}
              style={{ backgroundColor: "inherit" }}
            >
              {option.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default CustomDropdown;
