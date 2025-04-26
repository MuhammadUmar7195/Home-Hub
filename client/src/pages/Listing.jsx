import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { PulseLoader } from "react-spinners";
import { TfiAlert } from "react-icons/tfi";
import {
  FaShare,
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
} from "react-icons/fa";
import axios from "axios";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const currentUser = useSelector((state) => state.user);
  const params = useParams();

  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const listingId = params.listingId;
        const { data } = await axios.get(`/api/listing/get/${listingId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (data?.success == false) {
          setError(true);
          setLoading(false);
          return;
        }   

        setListing({
          imageUrls: data?.body?.imageUrls || [],
          name: data.body?.name || "",
          description: data.body?.description || "",
          address: data.body?.address || "",
          type: data?.body?.type || "rent",
          bedrooms: data?.body?.bedrooms || 1,
          bathrooms: data?.body?.bathrooms || 1,
          regularPrice: data?.body?.regularPrice || 50,
          discountPrice: data?.body?.discountPrice || 0,
          offer: data?.body?.offer || false,
          parking: data?.body?.parking || false,
          furnished: data?.body?.furnished || false,
          userRef: data?.body?.userRef || "",
          updated: data?.body?.updatedAt || null,
          id: data?.body?._id || null
        });
        setLoading(false);
        setError(false);
      } catch (error) {
        console.log("fetch List error", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && (
        <p className="flex items-center justify-center min-h-screen">
          <PulseLoader size={20} color="#a0ada3" />
        </p>
      )}
      {error && (
        <p className="flex items-center justify-center my-7 text-2xl font-semibold animate-pulse">
          Something went wrong! <TfiAlert className="fill-red-500 ml-1" />
        </p>
      )}

      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing?.imageUrls?.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 3000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-white text-green-600 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing?.name} - ${" "}
              {listing?.offer
                ? listing?.discountPrice?.toLocaleString("en-US") ?? ""
                : listing?.regularPrice?.toLocaleString("en-US") ?? ""}
              {listing?.type === "rent" && " / month"}
            </p>
            <span className="font-semibold">
              Created at:{" "}
              {listing?.updated
                ? new Date(listing.updated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </span>
            <p className="flex items-center mt-1 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing?.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing?.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing?.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing?.regularPrice - +listing?.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing?.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing?.bedrooms > 1
                  ? `${listing?.bedrooms} beds `
                  : `${listing?.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing?.bathrooms > 1
                  ? `${listing?.bathrooms} baths `
                  : `${listing?.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing?.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing?.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser &&
              listing?.userRef !== currentUser?._id &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-600 text-white cursor-pointer rounded-lg uppercase hover:opacity-95 p-3"
                >
                  Contact Owner{" "}
                </button>
              )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
