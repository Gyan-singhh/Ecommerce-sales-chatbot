import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUser(null);
      navigate("/");
    }
  };

  return (
    <nav className="bg-[#131921] text-white flex justify-between items-center px-6 py-4">
      <Link to="/" className="text-2xl font-bold text-[#febd69]">ShopBot</Link>
      
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:underline">Home</Link>
        {isLoggedIn ? (
          <>
            <Link to="/cart" className="flex items-center gap-1 hover:underline">
              <FaShoppingCart /> Cart
            </Link>
            <button
              onClick={handleLogout}
              className="bg-[#febd69] text-black px-4 py-1 rounded hover:bg-yellow-400 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
