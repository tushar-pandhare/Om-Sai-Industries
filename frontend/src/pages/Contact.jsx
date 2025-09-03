import { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/omsai/messages", form);
    alert("Message sent!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input type="text" placeholder="Your Name" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border w-full p-2"/>
        <input type="email" placeholder="Your Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="border w-full p-2"/>
        <textarea placeholder="Message" value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          className="border w-full p-2"/>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default Contact;
