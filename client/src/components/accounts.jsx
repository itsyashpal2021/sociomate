import React, { useEffect, useState } from "react";
import "../css/form.css";
import "../css/accounts.css";
import { postToNodeServer } from "../utils";

export default function Accounts() {
  const [platform, setPlatform] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    document.getElementById("search").focus();
  }, [platform]);

  window.addEventListener("shown.bs.modal", function () {
    setSearchResults([]);
    document.getElementById("search").value = "";
    document.getElementById("search").focus();
  });

  const onSearch = async () => {
    const res = await postToNodeServer("/accountSearch", {
      platform: platform,
      username: searchText,
    });
    if (res.status === 200) {
      setSearchResults(res.searchResults);
    }
  };

  const addAccount = async (id) => {
    const res = await postToNodeServer("/addAccount", {
      platform: platform,
      id: id,
    });
    console.log(res);
  };

  const getSearchLabel = () => {
    let label = "";
    switch (platform) {
      case "Youtube":
        label = "Channel Name";
        break;

      case "Instagram":
        label = "Username";
        break;

      case "Twitter":
        label = "Twitter Handle";
        break;

      case "Facebook":
        label = "Username";
        break;

      default:
        break;
    }
    return (
      <label
        htmlFor="search"
        className="form-label"
        style={{ color: "rgb(232, 170, 66)" }}
      >
        {label}
      </label>
    );
  };

  return (
    <div className="container-fluid row">
      <div className="col-11 d-flex flex-column mt-2">
        <button
          className="btn btn-primary ms-auto"
          data-bs-toggle="modal"
          data-bs-target="#addAccountModal"
          onClick={() => setPlatform("Youtube")}
        >
          <i className="fa-solid fa-plus me-2" />
          Add Account
        </button>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="addAccountModal"
        tabIndex="-1"
        aria-labelledby="addAccountModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-dialog-xl"
          style={{ height: "80vh" }}
        >
          <div className="modal-content bg-dark h-100">
            <div className="modal-header">
              <h1
                className="modal-title fs-4 text-info"
                id="addAccountModalLabel"
              >
                Add Social Media Account
              </h1>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex flex-column overflow-y-hidden h-100">
              <div className="d-flex">
                <div className="me-2">
                  <label
                    htmlFor="platform"
                    className="form-label"
                    style={{ color: "rgb(232, 170, 66)" }}
                  >
                    Platform
                  </label>

                  {/* custum dropdown */}
                  <span
                    className="text-white fs-6 d-block p-2 mt-1 border rounded user-select-none position-relative"
                    style={{ cursor: "context-menu" }}
                    onClick={() => {
                      document.getElementById("optionMenu").style.display ===
                      "none"
                        ? (document.getElementById("optionMenu").style.display =
                            "block")
                        : (document.getElementById("optionMenu").style.display =
                            "none");
                    }}
                  >
                    <img
                      src={
                        platform === ""
                          ? ""
                          : require(`../Images/${platform.toLowerCase()}.png`)
                      }
                      alt="yt"
                      className="me-1 socialMediaIcon"
                    />
                    <span className="d-none d-md-inline">{platform}</span>
                    <i className="fa-sharp fa-solid fa-caret-down ms-2" />
                    <div
                      className="border rounded position-absolute bg-dark"
                      style={{
                        width: "100%",
                        top: "115%",
                        left: 0,
                        display: "none",
                      }}
                      id="optionMenu"
                    >
                      <div
                        className="d-flex align-items-center px-2 pt-2 pb-1 rounded"
                        onClick={() => setPlatform("Youtube")}
                      >
                        <img
                          src={require("../Images/youtube.png")}
                          alt="yt"
                          className="me-1 socialMediaIcon"
                        />
                        <span>Youtube</span>
                      </div>
                      <div
                        className="d-flex align-items-center px-2 py-1 rounded"
                        onClick={() => setPlatform("Instagram")}
                      >
                        <img
                          src={require("../Images/instagram.png")}
                          alt="insta"
                          className="me-1 socialMediaIcon"
                        />
                        <span>Instagram</span>
                      </div>
                      <div
                        className="d-flex align-items-center px-2 py-1 rounded"
                        onClick={() => setPlatform("Facebook")}
                      >
                        <img
                          src={require("../Images/facebook.png")}
                          alt="fb"
                          className="me-1 socialMediaIcon"
                        />
                        <span>Facebook</span>
                      </div>
                      <div
                        className="d-flex align-items-center px-2 pt-1 pb-2 rounded"
                        onClick={() => setPlatform("Twitter")}
                      >
                        <img
                          src={require("../Images/twitter.png")}
                          alt="twt"
                          className="me-1 socialMediaIcon"
                        />
                        <span>Twitter</span>
                      </div>
                    </div>
                  </span>
                </div>

                {/* search input  */}
                <div className="ms-4">
                  {getSearchLabel()}
                  <div className="position-relative">
                    <input
                      type="search"
                      name="search"
                      id="search"
                      className="form-control-lg text-black"
                      style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                      autoComplete="off"
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value !== "")
                          onSearch();
                      }}
                    />
                    <button
                      className="position-absolute btn btn-search px-3"
                      disabled={searchText === ""}
                      onClick={onSearch}
                    >
                      <i className="fa-solid fa-magnifying-glass text-black fw-bold fs-5" />
                    </button>
                  </div>
                </div>
              </div>
              {searchResults.length === 0 ? (
                <></>
              ) : (
                <div className="mt-2 overflow-y-scroll h-100 p-2">
                  {searchResults.map((searchResult) => {
                    return (
                      <div
                        key={searchResult.channelId}
                        className="text-white d-flex align-items-center p-2 my-2"
                      >
                        <img
                          src={searchResult.thumbnail}
                          alt="thumbnail"
                          className="rounded-circle"
                        />
                        <div className="ms-3" style={{ maxWidth: "70%" }}>
                          <span className="h5 d-block m-0">
                            {searchResult.channelTitle}
                          </span>
                          <span
                            className="text-white-50 mt-1 d-inline-block"
                            style={{ fontSize: "14px", lineHeight: 1.2 }}
                          >
                            {searchResult.description}
                          </span>
                        </div>
                        <button
                          className="btn btn-success ms-auto"
                          onClick={() => addAccount(searchResult.channelId)}
                        >
                          Add
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
