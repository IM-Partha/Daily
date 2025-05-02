import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";

const Login = () => {
  const [information, setInformation] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!information.email || !emailRegex.test(information.email)) {
      setError("Please enter a valid email address.");
      toast.error("Invalid email format.");
      return;
    }

    // Password validation
    if (!information.password || information.password.length < 6) {
      setError("Password must be at least 6 characters.");
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        information.email,
        information.password
      );

      const user = userCredential.user;
      navigate("/");
      toast.success("Login successful!");
    } catch (err) {
      setError("Error logging in: " + err.message);
      toast.error("Error logging in: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[500px] flex justify-center items-center bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-[350px] p-6 bg-white rounded-md shadow-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        <input
          type="email"
          name="email"
          value={information.email}
          onChange={handleChange}
          placeholder="Email address"
          className="cursor-pointer p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          name="password"
          value={information.password}
          onChange={handleChange}
          placeholder="Password"
          className="cursor-pointer p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black cursor-pointer text-white py-2 rounded-md hover:bg-gray-800 transition"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <Link
          className="bg-[#dfe6e9] text-black text-center cursor-pointer py-2 rounded-md hover:bg-[#ecf0f1] transition"
          to="/register"
        >
          Register
        </Link>
      </form>
    </div>
  );
};

export default Login;
