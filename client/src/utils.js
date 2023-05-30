import axios from "axios";
axios.interceptors.response.use(
  (res) => {
    // console.log("here1");
    return { status: res.status, ...res.data };
  },
  (error) => {
    // console.log("in error", error);
    return {
      status: error.response.status,
      message: error.response.data.message,
    };
  }
);

const nodeURL = "http://localhost:5000";

export const postToNodeServer = async (route, body) => {
  // console.log("in post");
  const res = await axios.post(nodeURL + route, body, {
    withCredentials: true,
  });
  return res;
};

export const formatNumberShort = (number) => {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(2) + "B";
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(2) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(2) + "K";
  }
  return number.toString();
};

export const startSpinner = (node) => {
  const spinner = node.querySelector(".spinner");
  node.style.color = "transparent";
  spinner.style.display = "block";
};

export const stopSpinner = (node) => {
  const spinner = node.querySelector(".spinner");
  node.style.color = "inherit";
  spinner.style.display = "none";
};
