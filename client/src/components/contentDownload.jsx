import React, { useState } from "react";
import {
  formatBytes,
  postToNodeServer,
  startSpinner,
  stopSpinner,
} from "../utils";
import Spinner from "./spinner";
import CustomDropdown from "./customDropdown";

export default function ContentDownload(props) {
  const video = props.video;

  const [thumbnailSize, setThumbnailSize] = useState(
    video.thumbnailSizes.default
  );
  const [videoSize, setVideoSize] = useState(video.videoQualityOptions[0].size);

  const thumbnailQualityOptions = Object.keys(video.thumbnailSizes).map(
    (key) => {
      return {
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: key,
      };
    }
  );

  const videoQualityOptions = video.videoQualityOptions.map((option) => {
    return {
      label: option.qualityLabel,
      value: option.qualityLabel,
    };
  });

  const audioQualityOptions = [
    { label: "Low", value: "lowestaudio" },
    { label: "High", value: "highestaudio" },
  ];

  const downloadThumbnail = async (e) => {
    const id = video.videoId;
    e.target.disabled = true;
    startSpinner(e.target);

    const res = await postToNodeServer(
      "/downloadThumbnail",
      {
        id: id,
        quality: document.getElementById("thumbnailQualityDropdown").dataset
          .value,
      },
      {
        onDownloadProgress: (progressEvent) => {
          console.log(progressEvent);
        },
      }
    );

    if (res.status === 200) {
      var link = document.createElement("a");
      link.href = res.data.data;
      link.download = `thumbnail_${video.videoId}`;
      link.click();
    }

    stopSpinner(e.target);
    e.target.disabled = false;
  };

  const downloadVideo = async (e) => {
    const url = "https://www.youtube.com/watch?v=" + video.videoId;
    e.target.disabled = true;
    startSpinner(e.target);

    const res = await postToNodeServer(
      "/downloadVideo",
      {
        url: url,
        qualityLabel: document.getElementById("videoQualityDropdown").dataset
          .value,
      },
      {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          console.log(progressEvent);
        },
      }
    );
    if (res.status === 200) {
      const videoUrl = res.data.url;
      var link = document.createElement("a");
      link.href = videoUrl;
      link.download = video.title + ".mp4";
      link.click();
    }
    stopSpinner(e.target);
    e.target.disabled = false;
  };

  const downloadAudio = async (e) => {
    const url = "https://www.youtube.com/watch?v=" + video.videoId;
    e.target.disabled = true;
    startSpinner(e.target);

    const res = await postToNodeServer(
      "/downloadAudio",
      {
        url: url,
        quality: document.getElementById("audioQualityDropdown").dataset.value,
      },
      {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          console.log(progressEvent);
        },
      }
    );
    if (res.status === 200) {
      const audioUrl = res.data.url;
      var link = document.createElement("a");
      link.href = audioUrl;
      link.download = video.title + ".mp3";
      link.click();
    }
    stopSpinner(e.target);
    e.target.disabled = false;
  };

  return (
    <div className="row container-fluid mt-3">
      {/* thumbnail download  */}
      <div className="col-3">
        <p className="text-info h5">Download Thumbnail:</p>
        <div className="d-flex">
          <div className="d-flex flex-column">
            <span className="text-white-50 fs-6 fw-bold">Quality</span>
            <CustomDropdown
              options={thumbnailQualityOptions}
              id="thumbnailQualityDropdown"
              optionHoverColor="rgba(0,0,0,0.45)"
              onValueChange={(value) =>
                setThumbnailSize(video.thumbnailSizes[value])
              }
            />
          </div>
          <div className="d-flex flex-column ms-4">
            <span className="text-white-50 fs-6 fw-bold">Size</span>
            <div className="d-flex">
              <span className="text-warning py-2">
                {formatBytes(thumbnailSize)}
              </span>
              <button
                className="btn btn-success ms-4 position-relative"
                style={{ height: "fit-content" }}
                onClick={downloadThumbnail}
              >
                Download
                <Spinner />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* video download  */}
      <div className="col-3">
        <p className="h5" style={{ color: "rgb(255 151 39)" }}>
          Download Video:
        </p>
        <div className="d-flex">
          <div className="d-flex flex-column">
            <span className="text-white-50 fs-6 fw-bold">Quality</span>
            <CustomDropdown
              options={videoQualityOptions}
              id="videoQualityDropdown"
              optionHoverColor="rgba(0,0,0,0.45)"
              onValueChange={(value) => {
                const size = video.videoQualityOptions.find(
                  (el) => el.qualityLabel === value
                ).size;
                setVideoSize(size);
              }}
            />
          </div>
          <div className="d-flex flex-column ms-4">
            <span className="text-white-50 fs-6 fw-bold">Size</span>
            <div className="d-flex">
              <span className="text-warning py-2">
                {formatBytes(videoSize)}
              </span>
              <button
                className="btn btn-success ms-4 position-relative"
                style={{ height: "fit-content" }}
                onClick={downloadVideo}
              >
                Download
                <Spinner />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* audio download  */}
      <div className="col-3">
        <p className="h5" style={{ color: "#fffb2d" }}>
          Download Audio:
        </p>
        <div className="d-flex">
          <div className="d-flex flex-column">
            <span className="text-white-50 fs-6 fw-bold">Quality</span>
            <CustomDropdown
              options={audioQualityOptions}
              id="audioQualityDropdown"
              optionHoverColor="rgba(0,0,0,0.45)"
              onValueChange={(value) => {}}
            />
          </div>
          <div className="d-flex flex-column ms-4">
            <span className="text-white-50 fs-6 fw-bold">Size</span>
            <div className="d-flex">
              <span className="text-warning py-2">
                {/* {formatBytes(videoSize)} */}
              </span>
              <button
                className="btn btn-success ms-4 position-relative"
                style={{ height: "fit-content" }}
                onClick={downloadAudio}
              >
                Download
                <Spinner />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
