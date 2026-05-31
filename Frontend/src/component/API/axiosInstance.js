import axios from "axios";

const axiosInstance = axios.create({
  // Fix the baseURL to point to the root of your backend
  baseURL: "https://blogai-upqk.onrender.com", 
  withCredentials: true, 
});

export default axiosInstance;