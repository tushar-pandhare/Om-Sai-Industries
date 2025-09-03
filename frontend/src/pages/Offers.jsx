import { useEffect, useState } from "react";
import axios from "axios";

const Offers = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/omsai/offers")
      .then(res => setOffers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Latest Offers</h2>
      {offers.map(o => (
        <div key={o._id} className="border p-4 rounded shadow mb-4">
          <h3 className="text-xl font-semibold">{o.title}</h3>
          <p>{o.description}</p>
          <p className="text-red-600">Valid Till: {new Date(o.validTill).toDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Offers;
