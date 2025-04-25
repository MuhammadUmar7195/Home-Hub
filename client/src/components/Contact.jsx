import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  console.log("listing", listing);
  console.log(owner);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/user/${listing?.userRef}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (data?.success === false) {
          console.log(data?.message);
          return;
        }
        console.log(data);
        setOwner(data);
        setError(false);
      } catch (error) {
        console.log("Message issue arises : ", error?.message);
        setError(true);
      }
    };

    fetchUser();
  }, [listing?.userRef]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="">
          Contact{" "}
          <span className="font-semibold pr-1">{owner?.rest?.username}</span>{" "}
          for
          <span className="font-semibold pl-1.5">
            {listing?.name?.toLowerCase()}
          </span>
        </p>
        {error && <p className="text-red-500">{error?.message}</p>}
        <textarea
          name="message"
          id="message"
          rows="2"
          value={message}
          onChange={onChange}
          placeholder="Enter your message here..."
          className="w-full border p-3 rounded-lg"
        ></textarea>
        <Link
          to={`mailto:${owner?.rest?.email}?subject=Regarding ${listing?.name}&body=${message}`}
          className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
        >
          Send Message
        </Link>
      </div>
    </>
  );
};

export default Contact;
