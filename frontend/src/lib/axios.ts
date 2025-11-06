import axios from "axios";

if(!import.meta.env.VITE_API_URL) {
    throw new Error("Missing VITE_API_URL environment variable");
}
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
  timeout: 30000,
});

export default axiosInstance;