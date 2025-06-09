import { useState, useEffect } from "react";
import { fetchProducts } from "../services/api.js";
import { Link, useNavigate } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";
import { useAuth } from "../auth/AuthContext.jsx";
import { addToCart } from "../services/api.js";
import toast from "react-hot-toast";

const HomePage = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleAddToCart = async (productId) => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      await addToCart(productId, userId, token);
      toast.success("Added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart.");
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts("");
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}

      <header className="py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-black">Our Products</h1>
        </div>
      </header>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-200"
            >
              {/* Image */}
              <div className="h-52 bg-white flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain p-4"
                />
              </div>

              {/* Info */}
              <div className="px-4 pb-5">
                <h3 className="font-semibold text-lg text-gray-800 truncate mt-2">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-green-600 font-bold text-lg my-2">₹{product.price.toFixed(2)}</p>

                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="w-full bg-[#febd69] text-black py-2 rounded-md font-semibold hover:bg-yellow-400 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Chat Button */}
      <Link
        to="/chat"
        className="fixed bottom-8 right-8 bg-[#007185] text-white p-4 rounded-full shadow-md hover:bg-[#005f6b] transition transform hover:scale-110"
        aria-label="Chat with us"
      >
        <FiMessageSquare size={24} />
      </Link>
    </div>
  );
};

export default HomePage;
