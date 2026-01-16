import axios from "axios";

const API = axios.create({
  baseURL: "https://smartapply-7msy.onrender.com"
});

// Attach access token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 and refresh token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        logout();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "https://smartapply-7msy.onrender.com/api/auth/refresh/",
          { refresh }
        );

        localStorage.setItem("access", res.data.access);

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        return API(originalRequest);

      } catch (err) {
        logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export function logout() {
  localStorage.clear();
  window.location.href = "/signin";
}

export default API;
