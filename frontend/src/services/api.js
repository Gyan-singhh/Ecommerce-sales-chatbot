import axios from "axios";

const token = localStorage.getItem("token") || null;

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
});

export const fetchProducts = async (query) => {
  try {
    const response = await API.get("/products", {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await API.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await API.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await API.post("/login", userData);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const addToCart = async (productId, userId, quantity = 1) => {
  try {
    const response = await API.post("/cart/add", {
      product_id: productId,
      user_id: userId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Add to cart error:", error);
    throw error;
  }
};

export const removeCartItem = async (productId) => {
  try {
    const response = await API.delete(`/cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Remove cart item error:", error);
    throw error;
  }
};

export const updateCartItemQuantity = async (product_id, newQuantity) => {
  if (newQuantity < 1) throw new Error("Quantity must be at least 1");

  try {
    const response = await API.put(`/cart/${product_id}/quantity`, {
      quantity: newQuantity,
    });
    return response.data;
  } catch (error) {
    console.error("Update cart item quantity error:", error);
    throw error;
  }
};

export const fetchCartItems = async () => {
  try {
    const response = await API.get("/cart/items");
    return response.data;
  } catch (error) {
    console.error("Fetch cart items error:", error);
    throw error;
  }
};
