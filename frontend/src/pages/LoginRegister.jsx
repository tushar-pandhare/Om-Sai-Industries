import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import logo from "../assets/profile icon.png"; // <-- your Girni logo here

const LoginRegister = ({ setRole }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister
        ? "http://localhost:5000/omsai/register"
        : "http://localhost:5000/omsai/login";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Save role (just example: backend can send role in response)
      if (data.role === "admin") {
        setRole("admin");
        localStorage.setItem("role", "admin");
        window.location.href = "/admin-dashboard";
      } else {
        setRole("user");
        localStorage.setItem("role", "user");
        window.location.href = "/home";
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8 sm:px-16 lg:px-24 bg-white">
        <div className="w-full max-w-md">
          {/* Girni Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Girni Logo" className="h-14 w-auto" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            {isRegister ? "Create an account" : "Sign in to your account"}
          </h2>
          <p className="text-gray-600 text-sm mb-6 text-center">
            {isRegister ? (
              <>
                Already a member?{" "}
                <button
                  onClick={() => setIsRegister(false)}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Not a member?{" "}
                <button
                  onClick={() => setIsRegister(true)}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Start a free trial
                </button>
              </>
            )}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Email address"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              {loading ? "Processing..." : isRegister ? "Register" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          {/* <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">Or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div> */}

          {/* Social Login */}
          {/* <div className="flex gap-4">
            <button className="flex items-center justify-center gap-2 w-1/2 border rounded-lg py-2 hover:bg-gray-50 transition">
              <FcGoogle size={20} /> Google
            </button>
            <button className="flex items-center justify-center gap-2 w-1/2 border rounded-lg py-2 hover:bg-gray-50 transition">
              <FaGithub size={20} /> GitHub
            </button>
          </div> */}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex w-1/2 bg-gray-50">
        <img
          src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1350&q=80"
          alt="Factory machinery"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default LoginRegister;
