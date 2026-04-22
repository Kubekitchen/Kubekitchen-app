import axios from "axios";

const createInstance = (baseURL) => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("kk_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem("kk_token");
        localStorage.removeItem("kk_user");
        window.location.href = "/login";
      }
      return Promise.reject(err);
    }
  );

  return instance;
};

export const authAPI = createInstance(import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:4001");
export const restaurantAPI = createInstance(import.meta.env.VITE_RESTAURANT_SERVICE_URL || "http://localhost:4002");
export const menuAPI = createInstance(import.meta.env.VITE_MENU_SERVICE_URL || "http://localhost:4003");
export const orderAPI = createInstance(import.meta.env.VITE_ORDER_SERVICE_URL || "http://localhost:4004");