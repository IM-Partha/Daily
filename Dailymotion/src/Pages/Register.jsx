import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { getFirestore, doc, setDoc, setLogLevel } from "firebase/firestore";
import { toast } from "react-toastify";

// Optional: Reduce console noise
setLogLevel("error");

const Register = () => {
  const [information, setInformation] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const db = getFirestore();

  // Handle input change
  function handleChange(e) {
    const { name, value } = e.target;
    setInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handle form submit with validation
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { name, email, password } = information;

    // 🔍 Form Validation
    if (!name.trim()) {
      setError("Please enter your full name.");
      toast.error("Name is required.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Invalid email format.");
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      toast.error("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user.uid);

      // Update profile
      await updateProfile(auth.currentUser, { displayName: name });
      console.log("Profile updated");

      // Save to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), { name, email });
      console.log("User saved in Firestore");

      // Success message
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err.code, err.message);
      toast.error("Error registering: " + err.message);
      setError(err.message);
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
        <h2 className="text-2xl font-semibold text-center mb-4">Sign up</h2>

        <input
          type="text"
          name="name"
          value={information.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="cursor-pointer p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

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
          {loading ? "Loading..." : "Sign up"}
        </button>

        <Link
          className="bg-[#dfe6e9] text-black text-center cursor-pointer py-2 rounded-md hover:bg-[#ecf0f1] transition"
          to="/"
        >
          Cancel
        </Link>
      </form>
    </div>
  );
};

export default Register;
