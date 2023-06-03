import React from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const accounts = useSelector((state) => state.userData.channels);

  const getYoutubeStats = () => {
    return (
      <div
        className="col-2 border border-2 border-black px-2 py-3 fw-bold rounded d-flex flex-column justify-content-center align-items-center position-relative"
        style={{ backgroundColor: "rgba(0,0,0,0.14)" }}
      >
        <img
          src={accounts.Youtube.details.thumbnail}
          alt="thumbnail"
          className="rounded-circle"
          style={{ width: "60%" }}
        />
        <div className="my-1">
          <img
            src={require("../Images/youtube.png")}
            alt="icon"
            width={"30px"}
          />
          <span className="text-white fs-6 ms-1">
            {accounts.Youtube.details.channelTitle}
          </span>
        </div>
        <hr
          className="bg-primary-subtle my-1 opacity-100 w-100"
          style={{ height: "3px" }}
        />
        <span className="text-danger">
          Subscribers : {accounts.Youtube.statistics.subscriberCount}
        </span>
        <span className="text-info">
          Views : {accounts.Youtube.statistics.viewCount}
        </span>
        <span className="text-warning">
          Videos : {accounts.Youtube.statistics.videoCount}
        </span>
      </div>
    );
  };

  return (
    <div className="container-fluid row justify-content-center">
      <div className="col-11 py-2 my-2">
        <span
          className="border border-2 border-black fw-normal h1 px-2 py-1 rounded text-white user-select-none"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <i className="fa-sharp fa-solid fa-chart-simple me-2 text-primary" />
          Statistics
        </span>
        <div className="container-fluid row align-items-around my-2 p-2 justify-content-evenly">
          {Object.keys(accounts).length === 0 ? (
            <div>No accounts added</div>
          ) : (
            <>
              {getYoutubeStats()}
              {getYoutubeStats()}
              {getYoutubeStats()}
              {getYoutubeStats()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
