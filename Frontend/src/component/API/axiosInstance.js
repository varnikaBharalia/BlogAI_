
import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://blogaibackend.vercel.app/",
  baseURL: "https://blogai-upqk.onrender.com/",
  withCredentials: true, 
});

export default axiosInstance;
