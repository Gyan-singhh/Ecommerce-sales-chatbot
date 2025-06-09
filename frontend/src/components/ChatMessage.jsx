import { ProductCard } from "./ProductCard.jsx";

export const ChatMessage = ({ message, onAddToCart }) => {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isUser = message.sender === "user";

  return (
    <div
      className={`p-3 rounded-xl max-w-[80%] text-sm ${
        isUser
          ? "bg-blue-100 ml-auto text-right"
          : "bg-gray-100 mr-auto text-left"
      } shadow-sm`}
    >
      <div className="text-xs text-gray-400 mb-1">{time}</div>
      {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
      {message.isProduct && (
        <div className="mt-2">
          <ProductCard product={message.product} onAddToCart={onAddToCart} />
        </div>
      )}
    </div>
  );
};


