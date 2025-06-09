import { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchProducts,
  fetchCategories,
  addToCart,
  fetchCartItems,
} from "../services/api.js";
import { ChatMessage } from "../components/ChatMessage.jsx";
import { toast } from "react-hot-toast";
import { useAuth } from "../auth/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { TypingIndicator } from "../components/TypingIndicator.jsx";

const ChatPage = () => {
  const { user } = useAuth();
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initData = async () => {
      try {
        const [cats, cartItems] = await Promise.all([
          fetchCategories(),
          user ? fetchCartItems() : [],
        ]);
        setCategories(cats);
        setCart(cartItems);
      } catch {
        toast.error("Failed to load initial data");
      }
    };
    initData();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input.trim(),
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (input.startsWith("/")) {
        await handleCommand(input);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { text: "", sender: "bot", isTyping: true },
      ]);

      const products = await fetchProducts(input);
      setMessages((prev) => prev.filter((msg) => !msg.isTyping));

      const botResponse = {
        text: products.length
          ? `Found ${products.length} products matching "${input}"`
          : `No products found for "${input}". Try different keywords.`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botResponse]);

      if (products.length > 0) {
        const productMessages = products.map((product) => ({
          sender: "bot",
          isProduct: true,
          product,
          timestamp: new Date().toISOString(),
        }));
        setMessages((prev) => [...prev, ...productMessages]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isTyping),
        {
          text: "Sorry, I encountered an error. Please try again.",
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      await delay(700);
      setIsLoading(false);
    }
  };

  const handleCommand = async (command) => {
    const cmd = command.toLowerCase().trim();
    setMessages((prev) => prev.filter((msg) => !msg.isTyping));

    if (cmd === "/cart") {
      setMessages((prev) => [
        ...prev,
        {
          text: "Redirecting you to your cart...",
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ]);
      navigate("/cart");
    } else if (cmd === "/help") {
      setMessages((prev) => [
        ...prev,
        {
          text: "Available commands:\n/cart - View your cart\n/clear - Reset chat\n/checkout - Complete purchase",
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ]);
    } else if (cmd === "/clear") {
      resetChat();
    } else if (cmd === "/checkout") {
      await handleCheckout();
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: "Unknown command. Type /help for available commands.",
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      if (!user) return toast.error("Please login to add items to cart");

      await addToCart(product.id, user.id);
      setCart(await fetchCartItems());
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Your cart is empty");

    toast.info("Checkout functionality is under process");
    setMessages((prev) => [
      ...prev,
      {
        text: `Checkout is currently under process. Please try again later.`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const resetChat = () => {
    setMessages([]);
    toast.success("Chat cleared");
  };

  const MemoizedChatMessage = useCallback(
    ({ message }) => (
      <ChatMessage message={message} onAddToCart={handleAddToCart} />
    ),
    [handleAddToCart]
  );

  return (
    <div className="flex flex-col h-screen bg-[#f3f3f3]">
      {/* Header */}
      <header className="text-black p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">ShopBot Assistant</h1>
      </header>

      {/* Chat Layout */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <p>Welcome to ShopBot Assistant!</p>
                <p>
                  Try asking for things like "best deals on mobiles" or "laptops
                  under ₹50000"
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <MemoizedChatMessage
                  key={`${msg.timestamp}-${idx}`}
                  message={msg}
                />
              ))
            )}

            {/* Typing Loader */}
            {isLoading && (
              <div className="flex items-center p-3 bg-gray-100 rounded-lg max-w-[80%] mr-auto">
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Categories */}
          <div className="p-2 bg-white border-t overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setInput(category)}
                  className="bg-[#e3e6e6] px-3 py-1 rounded-full text-sm whitespace-nowrap hover:bg-[#d5d9d9] transition"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask for products or type /help for commands..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-[#febd69] text-black px-4 py-2 rounded-lg hover:bg-yellow-400 disabled:bg-gray-400 transition"
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
