import React, { useState } from "react";
import { Link } from "react-router-dom";
import { postToNodeServer } from "../utils.js";
import Spinner from "./spinner";
import ContentDownload from "./contentDownload.jsx";

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [contentToDownload, setContentToDownload] = useState(undefined);

  const onSearch = async () => {
    document.getElementById("homeSearchSpinner").style.display = "block";

    const res = await postToNodeServer("/ytSearch", { searchText: searchText });
    if (res.status === 200) {
      setSearchResult([...res.data.searchResult]);
    }
    document.getElementById("homeSearchSpinner").style.display = "none";
  };

  return (
    <div className="container-fluid row justify-content-center">
      <div className="col-10 p-2 my-2 d-flex flex-column align-items-center">
        {/* searchbar */}
        <div className="d-flex mb-4">
          <input
            type="searchYt"
            name="searchYt"
            id="searchYt"
            placeholder="Search Youtube"
            className="form-control-lg text-black"
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
            autoComplete="off"
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value !== "") onSearch();
            }}
          />
          <button
            className="btn btn-secondary px-3"
            disabled={searchText === ""}
            style={{
              border: "2px solid black",
              borderLeft: "none",
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
        <div className="position-relative">
          {searchResult.length !== 0 ? (
            searchResult.map((video) => {
              const publishedDate = new Date(video.publishedAt);
              return (
                <div
                  className="w-100 p-3 rounded my-2 d-flex align-items-center"
                  key={video.videoId}
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  <img
                    src={video.thumbnail}
                    alt="thumbnail"
                    className="rounded"
                    style={{ width: "250px" }}
                  />
                  <div className="mx-3 d-flex flex-column">
                    <Link
                      to={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      className="h5 text-white m-0 text-decoration-none"
                    >
                      {video.title}
                    </Link>
                    <p className="fs-6 fw-bold text-warning my-1">
                      {video.channelTitle}
                    </p>
                    <p className="mb-1 text-white-50 fw-bold">
                      published on {publishedDate.toDateString()}
                    </p>
                    <p className="m-0 text-info" style={{ fontSize: "14px" }}>
                      {video.description}
                    </p>
                  </div>
                  <button
                    className="btn btn-outline-success ms-auto align-self-start"
                    onClick={() => setContentToDownload(video)}
                  >
                    <i className="fa-solid fa-download" />
                  </button>
                </div>
              );
            })
          ) : (
            <></>
          )}
          {/* {download modal} */}
          <ContentDownload
            video={contentToDownload}
            setVideo={setContentToDownload}
          />
        </div>
      </div>
    </div>
  );
}
