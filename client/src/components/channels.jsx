import React from "react";
import "../css/form.css";
import Spinner from "./spinner";
import { formatNumberShort, postToNodeServer } from "../utils";
import { useOutletContext } from "react-router-dom";

export default function Channels() {
  const {
    channelSearchText,
    setChannelSearchText,
    channelSearchResult,
    setChannelSearchResult,
  } = useOutletContext();

  const onSearch = async () => {
    document.getElementById("chaannelSearchSpinner").style.display = "block";
    setChannelSearchResult([]);
    const res = await postToNodeServer("/ytChannelSearch", {
      channelName: channelSearchText,
    });
    if (res.status === 200) {
      setChannelSearchResult([...res.data.searchResults]);
    }
    document.getElementById("chaannelSearchSpinner").style.display = "none";
  };

  return (
    <div className="container-fluid m-0 p-2">
      {/* Searchbard */}
      <div
        className="d-flex mb-4 justify-content-center"
        style={{ height: "50px" }}
      >
        <input
          type="text"
          id="searchYtChannel"
          placeholder="Enter Channel Name"
          className={"form-control-lg text-black border border-3 border-dark"}
          style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            maxWidth: "768px",
          }}
          autoComplete="off"
          onChange={(e) => {
            setChannelSearchText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value !== "") onSearch();
          }}
        />
        <button
          className="btn btn-secondary h-100 px-3"
          disabled={channelSearchText === ""}
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          onClick={onSearch}
        >
          <i className="fa-solid fa-magnifying-glass text-black fw-bold fs-5" />
        </button>
      </div>

      <div className="col-lg-9 col-12 p-2 my-2 d-flex flex-column align-items-center mx-auto">
        {/* loader */}
        <Spinner
          className="position-static"
          id="chaannelSearchSpinner"
          style={{
            width: "50px",
            stroke: "cornsilk",
          }}
        />

        {/* Search Results */}
        {channelSearchResult.map((channel) => {
          //viewCount subscriberCount hiddenSubscriberCount videoCount
          return (
            <div
              className="d-flex align-items-center w-100 p-3 my-2 rounded"
              key={channel.channelId}
              style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
            >
              <img
                src={channel.thumbnail}
                alt="logo"
                className="rounded-circle"
                style={{ width: "150px" }}
              />
              <div className="d-flex flex-column mx-2">
                <span className="h3 text-white">{channel.channelTitle}</span>
                <span
                  className="text-white-50"
                  style={{
                    fontSize: "14px",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    overflow: "hidden",
                  }}
                >
                  {channel.description}
                </span>
              </div>
              <div
                className="d-flex flex-column fw-bold ms-auto me-3"
                style={{ whiteSpace: "nowrap" }}
              >
                <span className="text-danger">
                  {formatNumberShort(channel.subscriberCount)} Subscribers
                </span>
                <span className="text-info">
                  {" "}
                  {formatNumberShort(channel.viewCount)} Views
                </span>
                <span className="text-warning">
                  {formatNumberShort(channel.videoCount)} Videos
                </span>
              </div>
              <button
                className="btn btn-danger mx-2"
                onClick={() => {
                  window.open(
                    `https://www.youtube.com/channel/${channel.channelId}`
                  );
                }}
              >
                Visit
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
