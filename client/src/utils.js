import axios from "axios";
axios.interceptors.response.use(
  (res) => {
    // console.log("here1");
    if (res.request.responseType === "blob") {
      const url = URL.createObjectURL(res.data);
      return { status: res.status, data: { url: url } };
    }
    return { status: res.status, data: { ...res.data } };
  },
  (error) => {
    // console.log("in error", error);
    return {
      status: error.response.status,
      message: error.response.data.message,
    };
  }
);

const nodeURL = "https://localhost:5000";

export const postToNodeServer = async (route, body, options = {}) => {
  // console.log("in post");
  const res = await axios.post(nodeURL + route, body, {
    withCredentials: true,
    ...options,
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
  node.classList.add("text-transparent");
  spinner.style.display = "block";
};

export const stopSpinner = (node) => {
  const spinner = node.querySelector(".spinner");
  node.classList.remove("text-transparent");
  spinner.style.display = "none";
};
