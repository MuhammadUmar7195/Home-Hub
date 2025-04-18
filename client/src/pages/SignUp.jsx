import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-4xl text-center font-semibold my-7">Sign up</h1>
      <form action="" className="flex flex-col gap-4 border-none">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="text"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
          Sign up
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an account? </p>
        <Link to={`/signin`}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
