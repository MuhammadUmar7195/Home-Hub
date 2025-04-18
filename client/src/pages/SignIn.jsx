import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [formData, setFormData] = useState({}); //initialize with empty object
  const [error, setError] = useState(null); //initialize with null
  const [loading, setLoading] = useState(false); //initialize with bool false
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/signin", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log("Signup response:", data);
      if (data?.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log("Caught error:", error);
      setError(
        error.response?.data?.message || error.message || "Signup failed"
      );
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-4xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 border-none">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="flex gap-2 pt-5">
        <p>Don't Have an account? </p>
        <Link to={`/signup`}>
          <span className="text-blue-700">Register</span>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
