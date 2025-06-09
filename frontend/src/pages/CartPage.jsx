import React, { useEffect, useState } from "react";
import {
  fetchCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "../services/api.js";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const data = await fetchCartItems();
      setCartItems(data.items || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await removeCartItem(productId);
      await loadCartItems();
    } catch (err) {
      setError(err.response?.data?.message || "Error removing item");
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 5) return;

    try {
      await updateCartItemQuantity(productId, newQuantity);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Error updating quantity");
    }
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) return <div className="p-4">Loading cart...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4 text-[#131921]">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600 mb-4">Your cart is empty.</p>
          <Link
            to="/"
            className="bg-[#febd69] text-black px-5 py-2 rounded-full font-medium hover:bg-yellow-400 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item._id || item.product_id}
              className="flex flex-col sm:flex-row gap-6 border-b pb-6"
            >
              <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-[#0f1111]">
                    {item.name}
                  </h2>
                  <span className="font-bold text-[#b12704]">
                    ₹{item.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-sm text-green-600 mt-1">In stock</p>
                {item.seller && (
                  <p className="text-sm text-gray-500">Sold by {item.seller}</p>
                )}

                <div className="flex items-center mt-4">
                  <div className="flex border rounded overflow-hidden">
                    <button
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                      onClick={() =>
                        handleQuantityChange(item.product_id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                      onClick={() =>
                        handleQuantityChange(item.product_id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="ml-4 text-sm text-blue-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-3 space-x-4 text-sm text-blue-600">
                  <button className="hover:underline">Save for later</button>
                  <button className="hover:underline">
                    See more like this
                  </button>
                  <button className="hover:underline">Share</button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-6 border-t">
            <div className="flex justify-end">
              <div className="text-right">
                <div className="text-xl font-medium text-gray-800">
                  Subtotal (
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items):{" "}
                  <span className="font-bold text-[#b12704]">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
                <button className="mt-4 bg-[#febd69] text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
