import { X, Trash2 } from "lucide-react";
import { useCart } from "../Home/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, addToCart, decreaseFromCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const cartList = Object.values(cartItems);
  const total = cartList.reduce(
    (sum, item) => sum + (item.finalprice ?? item.price) * item.quantity,
    0
  );

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>}

      <div className={`fixed top-0 right-0 h-full w-80 bg-white text-black shadow-lg transform z-50 transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cartList.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">🛒 Cart is empty</p>
          ) : (
            <ul className="space-y-4">
              {cartList.map((item) => {
                const priceToShow = item.finalprice ?? item.price;
                return (
                  <li key={item.id} className="flex gap-4 items-center border-b pb-2">
                    <img src={item.thumbnail} alt={item.name} className="w-16 h-16 rounded object-cover border" />
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.finalprice && item.finalprice < item.price ? (
                          <>
                            {/* <span className="line-through text-gray-400 text-xs">৳{item.price.toFixed(2)}</span>{" "} */}
                            <span className="text-green-600 font-semibold">৳{priceToShow.toFixed(2)}</span>
                          </>
                        ) : (
                          <>৳{priceToShow.toFixed(2)}</>
                        )}
                      </p>

                      <div className="flex items-center mt-1 space-x-2">
                        <button onClick={() => decreaseFromCart(item)} className="px-2 bg-gray-200 text-sm rounded hover:bg-gray-300">-</button>

                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value > 0) updateQuantity(item, value);
                          }}
                          onBlur={(e) => {
                            const value = parseInt(e.target.value);
                            if (isNaN(value) || value <= 0) updateQuantity(item, 1);
                          }}
                          className="w-16 border rounded px-2 py-1 text-center"
                        />

                        {/* ✅ Pass existing finalprice when increasing quantity */}
                      <button
  onClick={() => addToCart(item, 1, item.finalprice)}
>
  +
</button>
                      </div>
                    </div>

                    <button onClick={() => removeFromCart(item)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex justify-between mb-3 text-sm text-gray-700">
            <span>Total:</span>
            <span className="font-semibold">৳ {total.toFixed(2)}</span>
          </div>

          <button onClick={onClose} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">Continue Shopping</button>
          <button onClick={() => { onClose(); navigate("/checkout"); }} className="w-full mt-2 bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500 transition">Checkout</button>
        </div>
      </div>
    </>
  );
}
