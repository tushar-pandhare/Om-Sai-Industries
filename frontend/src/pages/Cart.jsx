import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  const goToProduct = (productId) => {
    navigate(`/products?scrollTo=${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-12 mt-26">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700">Your cart is empty</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                onClick={() => goToProduct(item.productId._id)}
                className="flex flex-col sm:flex-row bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
              >
                <img
                  src={item.productId.imageUrl}
                  alt={item.productId.name}
                  className="w-full sm:w-28 h-40 object-cover rounded-lg"
                />
                <div className="mt-3 sm:mt-0 sm:ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.productId.name}</h3>
                  <p className="text-gray-600 text-sm">{item.productId.description}</p>
                  <p className="text-green-600 font-bold mt-2">
                    ₹{item.productId.price} × {item.quantity} = ₹{item.productId.price * item.quantity}
                  </p>
                  <div className="flex items-center mt-3 space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); updateQuantity(item._id, -1); }} className="px-3 py-1 bg-gray-200 rounded">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={(e) => { e.stopPropagation(); updateQuantity(item._id, 1); }} className="px-3 py-1 bg-gray-200 rounded">+</button>
                    <button onClick={(e) => { e.stopPropagation(); removeFromCart(item._id); }} className="ml-auto text-red-600 hover:underline">Remove</button>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Total: ₹{totalPrice}</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
