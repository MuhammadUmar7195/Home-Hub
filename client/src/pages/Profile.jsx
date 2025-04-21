import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createClient } from "@supabase/supabase-js";

const Profile = () => {
  const { currentUser } = useSelector((state) => state?.user);
  const [file, setFile] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    avatar: currentUser?.rest?.avatar || "",
  });
  const fileRef = useRef(null);

  const supabaseUrl = "https://vjwbscpnejglevqvkkhq.supabase.co";
  const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey); //connection success to supabase

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]); // jasa hi file mila ghi useEffect mount ho gha or function call kr de gha based on refresh

  const handleFileUpload = async (file) => {
    try {
      setFileUploadError(false);
      setUploadProgress(10);

      if (!currentUser?.rest?._id) {
        throw new Error("User ID not available");
      }

      const fileName = `${
        currentUser?.rest?._id
      }-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

      const { data, error } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (error) throw error;

      setUploadProgress(70);

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, avatar: publicUrl }));
      setUploadProgress(100);
    } catch (error) {
      console.error("Upload error:", error);
      setFileUploadError(true);
      setUploadProgress(0);
    }
  };

  const handleImageError = (e) => {
    e.target.src =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4 border-none">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current?.click()}
          className="rounded-full h-28 w-28 object-cover cursor-pointer self-center mt-2"
          src={
            formData?.avatar ||
            currentUser?.rest?.avatar ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt="profile"
          onError={handleImageError}
        />

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {fileUploadError && (
          <p className="text-red-700 text-center">
            Error uploading image. Please try again.
          </p>
        )}

        {uploadProgress === 100 && (
          <p className="text-green-500 text-center">
            Image uploaded successfully!
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.rest?.username}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.rest?.email}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
        />

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90">
          Update
        </button>
        <button className="bg-green-500 cursor-pointer text-slate-50 p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
          Create Listing
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};

export default Profile;
