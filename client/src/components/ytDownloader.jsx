import React, { useState } from "react";
import { formatNumberShort, postToNodeServer } from "../utils.js";
import Spinner from "./spinner.jsx";
import ContentDownload from "./contentDownload.jsx";
import { useOutletContext } from "react-router-dom";

export default function YtDownloader() {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState(undefined);
  const windowWidth = useOutletContext();

  const isValidYTUrl = (url) => {
    // https://youtu.be/yyzLruH9aEw
    // https://www.youtube.com/watch?v=yyzLruH9aEw

    const regex =
      /https:\/\/(youtu.be\/|www.youtube.com\/watch\?v=)[^#&?/]{11}/;

    return regex.test(url);
  };

  const onSearch = async () => {
    document.getElementById("homeSearchSpinner").style.display = "block";
    setSearchResult(undefined);
    const res = await postToNodeServer("/ytVideoSearch", {
      url: searchText,
    });
    if (res.status === 200) {
      setSearchResult({ ...res.data.searchResult });
    } else {
      setSearchResult({});
    }
    document.getElementById("homeSearchSpinner").style.display = "none";
  };

  return (
    <div className="container-fluid row justify-content-center m-0 p-0">
      <div className="col-lg-11 col-12 p-2 my-2 d-flex flex-column align-items-center">
        {/* searchbar */}

        <div className="d-flex mb-4 align-items-center w-100">
          <input
            type="searchYt"
            name="searchYt"
            id="searchYt"
            placeholder="Enter Youtube Video Link"
            className={
              "form-control-lg text-black border border-3 " +
              (searchText === ""
                ? "border-black"
                : isValidYTUrl(searchText)
                ? "border-success"
                : "border-danger")
            }
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
            autoComplete="off"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                e.target.value !== "" &&
                isValidYTUrl(e.target.value)
              )
                onSearch();
            }}
          />
          <button
            className="btn btn-success h-100 px-3"
            disabled={searchText === "" || !isValidYTUrl(searchText)}
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            onClick={onSearch}
          >
            <i className="fa-solid fa-magnifying-glass text-black fw-bold fs-5" />
          </button>
        </div>

        {/* loader */}
        <Spinner
          className="mt-5 position-static"
          id="homeSearchSpinner"
          style={{
            width: "50px",
            stroke: "crimson",
          }}
        />

        {/* search results */}
        {searchResult ? (
          Object.keys(searchResult).length === 0 ? (
            <h2 className="text-center text-dark">
              Video not found. Please check if the link is correct.
            </h2>
          ) : (
            <>
              <div
                className="w-100 p-3 rounded my-2 d-flex align-items-center justify-content-center flex-md-nowrap flex-wrap"
                key={searchResult.videoId}
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                <img
                  src={searchResult.thumbnail}
                  alt="thumbnail"
                  className="rounded mb-md-0 mb-3"
                  style={{ width: windowWidth >= 768 ? "250px" : "100%" }}
                />
                <div
                  className="mx-md-3 d-flex flex-column"
                  style={{ maxWidth: "100%" }}
                >
                  <p className="h5 text-white m-0 text-decoration-none">
                    {searchResult.title}
                  </p>
                  <p className="fs-6 fw-bold text-warning my-1">
                    <img
                      src={searchResult.channelThumbnail}
                      alt="ct"
                      className="d-inline rounded-circle me-2"
                      style={{ height: "25px" }}
                    />
                    {searchResult.channelTitle}
                  </p>
                  <p className="mb-1 text-white-50 fw-bold">
                    <span className="me-2">
                      {formatNumberShort(searchResult.viewCount)} views,
                    </span>
                    published on{" "}
                    {(function () {
                      const publishedDate = new Date(searchResult.publishedAt);
                      return publishedDate.toDateString();
                    })()}
                  </p>
                  <p
                    className="m-0 text-info"
                    style={{
                      fontSize: "14px",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                    }}
                  >
                    {searchResult.description}
                  </p>
                </div>
                <button
                  className="btn btn-danger me-md-2 mt-4 mx-md-auto my-md-0"
                  style={{ whiteSpace: "nowrap" }}
                  onClick={() => {
                    const url = `https://www.youtube.com/watch?v=${searchResult.videoId}`;
                    window.open(url, "_blank");
                  }}
                >
                  Watch
                </button>
              </div>
              <ContentDownload video={searchResult} />
            </>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
