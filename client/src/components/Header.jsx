import React from "react";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

const Header = () => {
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-2xl sm:text-xl flex flex-wrap ">
            <div className="space-x-1">
              <span className="text-slate-500">Home</span>
              <span className="text-slate-700">Hub</span>
            </div>
          </h1>
        </Link>
        <form
          action=""
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <CiSearch />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            <li className=" text-slate-700 hover:underline">Sign in</li>
          </Link>
         
        </ul>
      </div>
    </header>
  );
};

export default Header;
