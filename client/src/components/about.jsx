import React from "react";

export default function About() {
  return (
    <div className="container-fluid p-4">
      <h2 style={{ color: "#001747" }}>
        Welcome to Yotuix: Your Ultimate YouTube Videos and Channels Toolbox!
      </h2>
      <p className="text-white-50 fs-6">
        At Yotuix, we bring you a comprehensive platform that enhances your
        YouTube experience like never before. Our goal is to provide you with a
        range of useful tools and features that will take your video watching
        and channel management to new heights. Whether you're a content creator,
        a video enthusiast, or simply someone who enjoys the vast world of
        YouTube, Yotuix has got you covered.
      </p>
      <p className="text-white-50 fs-6">
        With Yotuix, you have the power to explore, download, and interact with
        YouTube videos like never before. Here's what you can do on our
        platform:
      </p>
      <div className="row container-fluid justify-content-between p-0 m-0 mt-2">
        <div className="col-lg-5 d-flex p-2">
          <p className="text-white fs-6 ms-2">
            <span
              className="text-info fw-bold fs-6"
              style={{ whiteSpace: "nowrap" }}
            >
              Thumbnail Extraction :{" "}
            </span>
            Need a specific thumbnail from a YouTube video? Yotuix allows you to
            extract and download the thumbnail of any video you desire. It's
            perfect for content creators who want to create custom thumbnails or
            for users who want to save captivating visuals.
          </p>
        </div>
        <div className="col-lg-5 d-flex p-2">
          <p className="text-white fs-6 ms-2">
            <span
              className="text-danger fw-bold fs-6"
              style={{ whiteSpace: "nowrap" }}
            >
              Video Download :{" "}
            </span>
            Enter any YouTube video link, and Yotuix will enable you to download
            the video in various formats and qualities. Whether you want to save
            a video for offline viewing or utilize it for other purposes, Yotuix
            has the tools to make it happen.
          </p>
        </div>
        <div className="col-lg-5 d-flex p-2">
          <p className="text-white fs-6 ms-2">
            <span
              className="text-warning fw-bold fs-6"
              style={{ whiteSpace: "nowrap" }}
            >
              Audio Extraction :{" "}
            </span>
            Sometimes you may only want the audio from a YouTube video. Yotuix
            enables you to extract the audio track from a video and download it
            separately. This feature is great for creating podcasts, music
            compilations, or simply enjoying your favorite songs on the go.
          </p>
        </div>
        <div className="col-lg-5 d-flex p-2">
          <p className="text-white fs-6 ms-2">
            <span
              className="text-success fw-bold fs-6"
              style={{ whiteSpace: "nowrap" }}
            >
              Subtitle Generation :{" "}
            </span>
            Yotuix also offers a powerful subtitle generation tool. You can
            input any YouTube video and automatically generate subtitles in
            various languages. It's a valuable feature for content creators
            looking to reach a broader audience or for viewers who prefer
            subtitles for a better understanding.
          </p>
        </div>
        <div className="col-lg-5 d-flex p-2">
          <p className="text-white fs-6 ms-2">
            <span
              className=" fw-bold fs-6"
              style={{ whiteSpace: "nowrap", color: "cyan" }}
            >
              Channel Stats :{" "}
            </span>
            Want to analyze the performance of your favorite YouTube channels?
            Yotuix provides detailed statistics and insights for any channel you
            choose. Stay up to date with subscriber counts, view counts,
            engagement metrics, and more. It's an excellent tool for both
            creators and enthusiasts to track the growth and popularity of
            channels.
          </p>
        </div>
      </div>
      <p className="text-white-50 fs-6">
        Join Yotuix today and unlock a whole new world of YouTube videos and
        toolbox. Explore, download, analyze, and create like never before. We
        are excited to have you on board and look forward to revolutionizing
        your YouTube experience!
      </p>

      <p className="fs-6 fw-bold" style={{ color: "bisque" }}>
        Note : Yotuix respects copyright laws and encourages users to download
        or utilize content for personal and non-commercial purposes only.
      </p>
    </div>
  );
}
