import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import supabase from "../supabase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../store/Slices/user.slice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import toast from "react-hot-toast";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state?.user);

  //for profile state
  const [file, setFile] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.rest?.username || "",
    email: currentUser?.rest?.email || "",
    avatar: currentUser?.rest?.avatar || "",
  });
  //for listing state
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListing, setUserListing] = useState([]);

  const fileRef = useRef(null);
  const dispatch = useDispatch();

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

      const { error } = await supabase.storage
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const { data } = await axios.post(
        `/api/user/update/${currentUser?.rest?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (data?.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      alert("Profile updated successfully!");
      setUpdateSuccess(true);
    } catch (error) {
      console.log("handle submit error: ", error);
      toast.error("Something went wrong");
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());

      const { data } = await axios.delete(
        `/api/user/delete/${currentUser?.rest?._id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (data?.success === false) {
        dispatch(deleteUserFailure(data.message));
      }
      dispatch(deleteUserSuccess(data));
      toast.success("User Deleted Successfully.");
    } catch (error) {
      console.log("handle delete user", error);
      toast.error("Something went wrong");
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signoutStart());
      const { data } = await axios.post(`/api/auth/signout`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (data?.success === false) {
        dispatch(signoutFailure(data.message));
        return;
      } else {
        toast.success("User signout successfully");
      }
      dispatch(signoutSuccess(data));
    } catch (error) {
      console.log("Handle signout error: ", error);
      toast.error("Something went wrong");
      dispatch(signoutFailure(error.message));
    }
  };

  const handleShowListing = async () => {
    try {
      setShowListingsError(false);
      const { data } = await axios.get(
        `/api/user/listing/${currentUser?.rest?._id}`
      );

      if (data?.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListing(data);
    } catch (error) {
      console.log("handle show listing:", error);
      setShowListingsError(true);
    }
  };

  const handleListDelete = async (listingId) => {
    try {
      const { data } = await axios.delete(`/api/listing/delete/${listingId}`);
      if (data?.success === false) {
        console.log(data?.message);
        return;
      }

      setUserListing((prev) => {
        // Ensure we're working with an array
        const currentListings = Array.isArray(prev) ? prev : [];
        return currentListings.filter((listing) => listing._id !== listingId);
      });
    } catch (error) {
      console.log("Handle List delete error: ", error?.message);
    }
  };
  return (
    <>
      {/* Profile section */}
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 border-none"
        >
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
          <div>
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
          </div>

          <input
            type="text"
            placeholder="Username"
            id="username"
            className="bg-white border p-3 rounded-lg"
            defaultValue={currentUser?.rest?.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="bg-white border p-3 rounded-lg"
            defaultValue={currentUser?.rest?.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="bg-white border p-3 rounded-lg"
          />

          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 cursor-pointer rounded-lg uppercase hover:opacity-90"
          >
            {loading ? "loading..." : "Update"}
          </button>
          <Link
            className="bg-green-500 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
            to={`/create-listing`}
          >
            Create Listing
          </Link>
        </form>
        <div className="flex justify-between mt-5">
          <span onClick={handleDelete} className="text-red-700 cursor-pointer">
            Delete account
          </span>
          <span onClick={handleSignout} className="text-red-700 cursor-pointer">
            Sign out
          </span>
        </div>
        <p className="text-red-700 mt-5">{error ? error : ""}</p>
        <p className="text-green-500 mt-5">
          {updateSuccess ? "User update successfully" : ""}
        </p>
      </div>
      {/* Show Listing of users section */}
      <div className="p-1 max-w-lg mx-auto">
        <button
          onClick={handleShowListing}
          className="text-green-500 w-full cursor-pointer"
        >
          Show Listing
        </button>
        {showListingsError && (
          <p className="text-red-700 text-center">{showListingsError}</p>
        )}
        {userListing?.body && userListing?.body.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-3xl font-semibold mb-3">
              Your Listing
            </h1>
            {/* {userListing?.body?.length} */}
            {userListing?.body.map((listing) => (
              <div
                key={listing._id}
                className="border-white rounded-lg p-3 flex justify-between items-center gap-4 bg-white"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing image"
                    className="h-16 w-16 object-contain rounded-lg"
                  />
                </Link>
                <Link
                  className="text-slate-950 font-semibold hover:opacity-70 truncate flex-1 "
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col item center gap-4">
                  <button
                    onClick={() => handleListDelete(listing?._id)}
                    className="cursor-pointer"
                  >
                    <MdDeleteOutline size={22} className=" fill-red-500" />
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="cursor-pointer">
                      <MdEdit size={22} className="fill-green-500" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
