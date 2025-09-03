import { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/omsai/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Our Products</h2>
      <div className="grid grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p._id} className="border p-4 rounded shadow">
            <img src={p.image} alt={p.name} className="h-40 w-full object-cover"/>
            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p>{p.description}</p>
            <p className="text-green-600 font-bold">₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
