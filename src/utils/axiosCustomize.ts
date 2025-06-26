import axios from "axios";
import qs from "qs";

const instance = axios.create({
  baseURL: "http://localhost:8080/",
  paramsSerializer: (params) => qs.stringify(params, { indices: false }),
});

instance.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem("access_token");
    console.log("🚀 [REQUEST]", config.url, "| AccessToken:", accessToken);
    if (accessToken && !config?.url?.includes("/auth")) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response?.data ? response.data : response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        console.log("♻️ Refreshing token with:", refreshToken);

        const res = await axios.post(
          "http://localhost:8080/auth/refresh",
          {},
          {
            headers: {
              "x-token": refreshToken,
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        console.log("✅ Retry original request:", originalRequest.url);
        return instance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject("Token expired. Please login again.");
      }
    }

    return Promise.reject(error?.response?.data?.message || error);
  }
);

export default instance;
