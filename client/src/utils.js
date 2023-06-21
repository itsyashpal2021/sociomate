import axios from "axios";
axios.interceptors.response.use(
  (res) => {
    if (res.request.responseType && res.request.responseType === "blob") {
      const url = URL.createObjectURL(res.data);
      return { status: res.status, data: { url: url } };
    }
    return { status: res.status, data: { ...res.data } };
  },
  (error) => {
    return {
      status: error.response.status,
      message: error.response.data.message,
    };
  }
);

// const nodeURL = "http://192.168.223.124:5000";
// const nodeURL = "http://localhost:5000";
const nodeURL = "https://youtix.onrender.com";

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

export const formatBytes = (bytes) => {
  if (bytes > 1073741824) {
    return (bytes / 1073741824).toFixed(2) + " GB";
  } else if (bytes > 1048576) {
    return (bytes / 1048576).toFixed(2) + " MB";
  } else if (bytes > 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  }
  return bytes.toString() + " B";
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
