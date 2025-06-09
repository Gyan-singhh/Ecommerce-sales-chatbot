export const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-contain bg-gray-50"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/150?text=No+Image";
        }}
      />
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm">{product.name}</h3>
        <p className="text-gray-600 text-xs line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[#b12704] font-bold">
            ₹{product.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-[#ffd814] hover:bg-yellow-400 text-black text-xs px-3 py-1 rounded font-medium transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
