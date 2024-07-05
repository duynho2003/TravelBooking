import axios from "axios";
import Cookie from "js-cookie";
import { isExpired } from "react-jwt";

import { BASE_URL } from "../utils/Constants";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
  function (config) {
    // console.log("Request config :", config);

    const token = Cookie.get("token");

    if (token) {
      if (isExpired(token)) {
        alert("Phiên bản đăng nhập hết hạn!");
        window.location.href = "/login";
        Cookie.remove("token");
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  function (error) {
    console.log("Request reject error :", error);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    console.log("Response data :", response.data);
    return response.data;
  },
  function (error) {
    console.log("Response reject error :", error.response);
    return Promise.reject(error.response);
  }
);

export default axiosClient;
