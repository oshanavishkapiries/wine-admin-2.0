import { ClipLoader } from "react-spinners";

const CLoader = ({ className }: { className?: string }) => {
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <ClipLoader />
    </div>
  );
};

export default CLoader;
