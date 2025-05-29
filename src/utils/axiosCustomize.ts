import axios from "axios";
import qs from "qs";
const instance = axios.create({
  baseURL: "http://localhost:8080/",
  paramsSerializer: (params) => qs.stringify(params, { indices: false }),
});

instance.interceptors.request.use(
  function (config) {
    const persistRoot = localStorage.getItem("persist:root");
    if (persistRoot) {
      try {
        // const parsed = JSON.parse(persistRoot);
        // const user = JSON.parse(parsed.user);
        // const token = user?.user?.refresh_token;
        // if (token && !config?.url?.includes("/auth/login")) {
        //   config.headers["Authorization"] = "Bearer " + token;
        // }
      } catch (err) {
        console.log("Token parse error:", err);
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response && response.data ? response.data : response;
  },
  function (error) {
    console.log(error);
    const customError = error?.response?.data?.message;
    console.log(customError);
    return Promise.reject(customError);
  }
);

export default instance;
