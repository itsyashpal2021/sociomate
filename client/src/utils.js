import axios from "axios";
axios.interceptors.response.use(
  (res) => {
    return { status: res.status, ...res.data };
  },
  (error) => {
    return {
      status: error.response.status,
      message: error.response.data.message,
    };
  }
);

const nodeURL = "http://localhost:5000";

export const postToNodeServer = async (route, body) => {
  const res = await axios.post(nodeURL + route, body, {
    withCredentials: true,
  });
  return res;
};
