
import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://blogaibackend.vercel.app/",
  // baseURL: "https://blogai-upqk.onrender.com/",
  // baseURL: "http://localhost:3000",
  baseURL:"https://blogai-upqk.onrender.com/user/signin",
  withCredentials: true, 
});

export default axiosInstance;
