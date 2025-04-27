import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-50 to-slate-100 py-6 px-4 border-t border-slate-200">
      <div className="max-w-4xl mx-auto">
        <Link to="/about">
          <p className="text-slate-600 text-center hover:text-slate-900 hover:underline transition-colors duration-200 font-medium">
            About Us
          </p>
        </Link>

        <div className="mt-4 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Home Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
