import { useState } from "react";
import supabase from "../supabase";
import { useSelector } from "react-redux";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state?.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const handleImageSubmit = () => {
    if (!currentUser?.rest?._id) {
      setImageUploadError("User ID not available");
      return;
    }

    if (files.length === 0 || files.length + formData.imageUrls.length >= 7) {
      setImageUploadError("You can upload up to 6 images (2 MB max each)");
      return;
    }

    setUploading(true);
    const promises = [];

    for (let i = 0; i < files.length; i++) {
      promises.push(storeImage(files[i]));
    }

    Promise.all(promises)
      .then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false);
      })
      .catch(() => {
        setImageUploadError("Image upload failed (max 2MB per image)");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const storeImage = async (file) => {
    const fileName = `${currentUser.rest._id}-${Date.now()}-${file.name.replace(
      /\s+/g,
      "-"
    )}`;
    const bucketName = "house-rent-images";

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = await supabase.storage.from(bucketName).getPublicUrl(fileName);

    return publicUrl;
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]:
          e.target.type === "number"
            ? parseInt(e.target.value)
            : e.target.value,
      });
    }
  };

  const handleRemove = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData?.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData?.imageUrls.length < 1) {
      return setError("You must upload at least one image");
    }
    try {
      const userId = currentUser?.rest?._id;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const { data } = await axios.post(
        "/api/listing/create",
        { ...formData, userRef: userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data?.success === false) {
        setError(data.message);
      } else if (data?.success === true) {
        toast.success("List created successfully")
      }
      
      navigate(`/listing/${data?.body?._id}`);
    } catch (error) {
      console.log("Handle Submit error: ", error);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            maxLength={62}
            minLength={10}
            placeholder="Name"
            className="bg-white border p-3 rounded-lg"
            onChange={handleChange}
            required
            value={formData?.name}
          />
          <textarea
            id="description"
            required
            placeholder="Description"
            className="bg-white border p-3 rounded-lg"
            onChange={handleChange}
            value={formData?.description}
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="bg-white border p-3 rounded-lg"
            onChange={handleChange}
            required
            value={formData?.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData?.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData?.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData?.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData?.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData?.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                value={formData?.bedrooms}
                min={1}
                max={10}
                required
                className="bg-white p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                value={formData?.bathrooms}
                min={1}
                max={10}
                required
                className="bg-white p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                value={formData?.regularPrice}
                min={50}
                max={10000000}
                required
                className="bg-white p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  value={formData?.discountPrice}
                  min={0}
                  max={formData?.regularPrice}
                  required
                  className="bg-white p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / Month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6 images)
            </span>
          </p>
          <div className="flex gap-4 rounded-lg">
            <input
              className="p-3 border bg-white border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 text-green-700 border bg-white border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-500 text-sm">{imageUploadError}</p>
          )}
          {formData?.imageUrls?.length > 0 &&
            formData?.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 items-center bg-white border-none rounded-lg"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  className="p-3 rounded-lg uppercase hover:opacity-75"
                  onClick={() => handleRemove(index)}
                >
                  <MdDeleteOutline size={24} className="fill-red-500"/>
                </button>
              </div>
            ))}
          <button
            type="submit"
            disabled={loading || uploading}
            className="p-4 bg-slate-700 cursor-pointer text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
          {error && <p className="text-red-500 ">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
