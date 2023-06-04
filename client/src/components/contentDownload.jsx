import React from "react";
import { postToNodeServer, startSpinner, stopSpinner } from "../utils";
import Spinner from "./spinner";

export default function ContentDownload(props) {
  const video = props.video;

  const downloadThumbnail = async (e) => {
    const initialColor = window.getComputedStyle(e.target).borderColor;

    const url = video.thumbnail;
    const format = "";

    startSpinner(e.target);

    const res = await postToNodeServer("/downloadThumbnail", {
      url: url,
    });
    if (res.status === 200) {
      var img = new Image();
      img.src = res.data;

      img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);

        var newData =
          format === "" ? img.src : canvas.toDataURL(`image/${format}`);

        var link = document.createElement("a");
        link.href = newData;
        link.download = `thumbnail_${video.videoId}`;
        link.click();
      };
    }
    stopSpinner(e.target, initialColor);
  };

  return (
    <div
      className={"rounded bg-dark " + (video ? "p-3" : "")}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: video ? "50vh" : "0",
        width: "100%",
        overflow: "hidden",
        transition: "all 0.7s ease-in",
      }}
    >
      <button
        className="btn btn-close btn-close-white opacity-100 d-block ms-auto"
        onClick={() => props.setVideo(undefined)}
      />
      <h2 className="text-info my-2 text-center">Download Content</h2>
      <div className="d-flex justify-content-evenly mt-4">
        <button
          className="btn btn-outline-success position-relative"
          onClick={downloadThumbnail}
        >
          <i className="fa-solid fa-arrow-alt-circle-down me-1" />
          Thumbnail
          <Spinner />
        </button>
        <button
          className="btn btn-outline-danger position-relative"
          onClick={(e) => {}}
        >
          <i className="fa-solid fa-arrow-alt-circle-down me-1" />
          Video
          <Spinner />
        </button>
      </div>
    </div>
  );
}
