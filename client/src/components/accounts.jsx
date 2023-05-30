import React from "react";
import "../css/form.css";
import "../css/accounts.css";
import { formatNumberShort, postToNodeServer } from "../utils";
import { useSelector, useDispatch } from "react-redux";
import { removeAccount } from "../store";
import AddAccountModal from "./addAccountModal";

export default function Accounts() {
  const accounts = useSelector((state) => state.userData.accounts);
  const dispatch = useDispatch();

  const onRemoveAccount = async (platform) => {
    const res = await postToNodeServer("/removeAccount", {
      platform: platform,
      id: accounts[platform],
    });
    if (res.status === 200) {
      dispatch(removeAccount(platform));
    }
  };

  const getAccountInfo = (platform) => {
    switch (platform) {
      case "Youtube":
        return (
          <>
            <div className="d-flex align-items-center justify-content-center flex-md-row flex-column">
              <img
                src={accounts.Youtube.details.thumbnail}
                alt="thumbnail"
                className="rounded-circle"
              />
              <div className="d-flex flex-column ms-lg-3 text-center mt-lg-0 mt-2">
                <span className="h3 text-white m-0">
                  {accounts.Youtube.details.channelTitle}
                </span>
                <span
                  className="d-inline-block text-white-50"
                  style={{ fontSize: "14px", lineHeight: 1.2 }}
                >
                  {accounts.Youtube.details.description}
                </span>
              </div>
            </div>
            <div className="mx-auto d-flex flex-column px-md-4 px-2 text-black">
              <span className="h1 m-0">
                {formatNumberShort(accounts.Youtube.statistics.subscriberCount)}
              </span>
              <span className="h5 fw-bold">subscribers</span>
            </div>
          </>
        );

      default:
        return <></>;
    }
  };

  return (
    <div className="container-fluid row m-0 p-0 justify-content-center">
      <div className="col-lg-11 col-12 d-flex flex-column">
        <AddAccountModal />
        <div>
          <span className="h3 p-2 my-3 d-inline-block px-3 rounded-pill text-bg-warning user-select-none">
            Added Accounts
          </span>
          {Object.keys(accounts).length === 0 ? (
            <div
              className="p-5 my-2 border border-2 border-black rounded-5"
              style={{ backgroundColor: "rgb(17 104 122)" }}
            >
              <h3 className="text-primary-emphasis text-center mb-1">
                Your added accounts appear here
              </h3>
              <p className="fs-6 fw-bold text-white-50 text-center m-0">
                You can add 1 account per social media platform.
              </p>
            </div>
          ) : (
            Object.keys(accounts).map((platform) => {
              return (
                <div
                  className="d-flex align-items-center py-5 px-lg-5 px-3  my-2 border border-2 border-black rounded-3 position-relative"
                  style={{ backgroundColor: "rgb(17 104 122)" }}
                  key={platform}
                >
                  {getAccountInfo(platform)}
                  <button
                    className="btn btn-dark btn-light h-100 p-2"
                    onClick={() => onRemoveAccount(platform)}
                  >
                    Remove
                  </button>

                  {/* platform tag */}
                  <div
                    className="px-2 py-1 rounded position-absolute user-select-none"
                    style={{
                      width: "fit-content",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      top: 0,
                      left: 0,
                    }}
                  >
                    <img
                      src={require("../Images/" +
                        platform.toLowerCase() +
                        ".png")}
                      alt="icon"
                      style={{ height: "25px" }}
                    />
                    <span className="d-inline-block fs-6 ms-1 my-auto text-white">
                      {platform}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
