import axios from "axios";
axios.interceptors.response.use(
  (res) => {
    console.log("here1");
    return { status: res.status, ...res.data };
  },
  (error) => {
    console.log("in error", error);
    return {
      status: error.response.status,
      message: error.response.data.message,
    };
  }
);

const nodeURL = "http://localhost:5000";

export const postToNodeServer = async (route, body) => {
  console.log("in post");
  const res = await axios.post(nodeURL + route, body, {
    withCredentials: true,
  });
  return res;
};
