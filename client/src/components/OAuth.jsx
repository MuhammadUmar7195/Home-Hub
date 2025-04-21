import React from "react";
import { IoLogoGoogle } from "react-icons/io5";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../store/Slices/user.slice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const data = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };

      const response = await axios.post("/api/auth/google", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const userData = {
        ...response?.data,
        photo: response?.data?.photo || result?.user?.photoURL,
      };
      
      dispatch(signInSuccess(userData));
      navigate("/");
    } catch (error) {
      console.log("Could not sign in with google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="flex items-center justify-center gap-2 bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 hover:cursor-pointer"
    >
      <IoLogoGoogle className="text-amber-50" />
      <span>Continue with Google</span>
    </button>
  );
};

export default OAuth;
