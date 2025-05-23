import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import ListingItem from "../components/listingItems";
import axios from "axios";

const SearchPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const { data } = await axios.get(`/api/listing/get?${searchQuery}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListing(data?.body);
      setLoading(false);
    };

    fetchListing();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("offer", sidebarData.offer);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberofListing = listing.length;
    const startIndex = numberofListing;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    const { data } = await axios.get(`/api/listing/get?${searchQuery}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (data.length < 9) {
      setShowMore(false);
    }
    setListing({ ...listing, ...data });
  };
  
  return (
    <div className="flex flex-col md:flex-row">
      {/* left section */}
      <div className="p-7 border-b-2 border-slate-200 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8 " onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term :{" "}
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border-none rounded-lg p-3 w-full bg-white"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              className="border-none rounded-lg p-3 bg-white cursor-pointer"
              defaultValue={"created_at_desc"}
              onChange={handleChange}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to hight</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 cursor-pointer text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      {/* right section */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b-2 border-slate-200 p-3 text-slate-700 mt-5">
          Listing Results
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listing.length === 0 && (
            <p className="text-xl text-slate-700">No listing found</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              <PulseLoader size={20} color="#a0ada3" />{" "}
            </p>
          )}

          {!loading &&
            listing &&
            listing.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full cursor-pointer"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
