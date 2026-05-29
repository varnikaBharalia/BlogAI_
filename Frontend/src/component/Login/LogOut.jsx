import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UseUser from "../UserContext/UserContext";
import axiosInstance from "../API/axiosInstance";

export default function Header() {
  const navigate = useNavigate();
  const { setCurrentUser } = UseUser();

  const handleLogout = async () => {
    try {

      await axiosInstance.get("/user/logOut");
      console.log("Logout clicked");
      setCurrentUser(null);
      toast.success("Logged out successfully!");
      navigate("/signin");
    } catch (err) {
      console.error(err);
      setCurrentUser(null);
      navigate("/signin");
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}