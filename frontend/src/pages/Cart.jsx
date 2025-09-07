import { useState } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      type: "product",
      name: "Premium Steel Rod",
      description: "High-quality steel rod for construction use.",
      price: 1200,
      imageUrl: "https://via.placeholder.com/200x150?text=Steel+Rod",
      quantity: 2,
    },
    {
      id: 2,
      type: "offer",
      name: "Diwali Combo Offer",
      description: "Get 20% off on industrial paints combo.",
      price: 2500,
      imageUrl: "https://via.placeholder.com/200x150?text=Paint+Combo",
      quantity: 1,
    },
  ]);

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, amount) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-12 mt-26">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
          Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white shadow rounded-lg">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">
              Your cart is empty
            </h3>
            <p className="mt-2 text-gray-500 text-sm sm:text-base">
              Add products and offers to see them here!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center bg-white shadow rounded-lg p-4 hover:shadow-lg transition"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full sm:w-28 h-40 sm:h-24 object-cover rounded-lg"
                />

                <div className="mt-3 sm:mt-0 sm:ml-4 flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <p className="text-green-600 font-bold mt-2 text-sm sm:text-base">
                    ₹{item.price} x {item.quantity} = ₹
                    {item.price * item.quantity}
                  </p>

                  {/* Buttons row */}
                  <div className="flex items-center mt-3 space-x-2 sm:space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="px-2 sm:px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="px-2 sm:px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="ml-auto text-red-600 text-sm sm:text-base hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Badge */}
                <span
                  className={`mt-3 sm:mt-0 sm:ml-4 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full self-start sm:self-auto`}
                  style={{
                    backgroundColor:
                      item.type === "offer" ? "#FEF9C3" : "#DBEAFE",
                    color: item.type === "offer" ? "#92400E" : "#1E40AF",
                  }}
                >
                  {item.type === "offer" ? "Offer" : "Product"}
                </span>
              </div>
            ))}

            {/* Total Section */}
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-0">
                Total: ₹{totalPrice}
              </h3>
              <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
