import { useState } from "react";
import axios from "axios";
import contactImg from "../assets/contactbg.png";
const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await axios.post("http://localhost:5000/omsai/messages", form);

      const subject = encodeURIComponent("New Contact Message");
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nMobile: ${form.mobile}\n\nMessage:\n${form.message}`
      );
      window.location.href = `mailto:mesonuu.248@gmail.com?subject=${subject}&body=${body}`;

      setForm({ name: "", email: "", mobile: "", message: "" });
      setSuccessMsg("Message sent successfully!");
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8 sm:px-16 lg:px-24 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
            Contact Us ✍️
          </h2>
          <p className="text-gray-600 text-sm mb-6 text-center">
            We'd love to hear from you! Fill out the form and we will get back
            to you.
          </p>

          {successMsg && (
            <p className="text-green-600 text-center mb-4">{successMsg}</p>
          )}
          {errorMsg && (
            <p className="text-red-600 text-center mb-4">{errorMsg}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Your Mobile Number"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
            <textarea
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px]"
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition`}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex w-1/2 bg-gray-50">
        <img
          src="https://images.unsplash.com/photo-1587560699334-bea93391dcef?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Contact Illustration"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default Contact;
