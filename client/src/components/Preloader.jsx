import { HashLoader } from "react-spinners";

const PreLoader = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <HashLoader color="#334155" size={120} />
    </div>
  );
};

export default PreLoader;
