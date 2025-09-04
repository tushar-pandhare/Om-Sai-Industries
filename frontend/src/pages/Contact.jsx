import { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Store in backend
      await axios.post("http://localhost:5000/omsai/messages", form);

      // Open Outlook
      const subject = encodeURIComponent("New Contact Message");
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nMobile: ${form.mobile}\n\nMessage:\n${form.message}`
      );
      window.location.href = `mailto:mesonuu.248@gmail.com?subject=${subject}&body=${body}`;

      // Reset form
      setForm({ name: "", email: "", mobile: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Get in Touch ✍️</h2>
        <p className="text-gray-600 mb-6 text-center">We'd love to hear from you!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />
          <input
            type="tel"
            placeholder="Your Mobile Number"
            value={form.mobile}
            onChange={e => setForm({ ...form, mobile: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />
          <textarea
            placeholder="Message"
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 min-h-[100px]"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-md font-semibold transition-all duration-300 ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;