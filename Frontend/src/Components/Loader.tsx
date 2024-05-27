import { FC } from "react";
import { HashLoader } from "react-spinners";

interface LoaderProps {
  size: number;
  color: string;
}

const Loader: FC<LoaderProps> = ({ size, color }) => {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <HashLoader size={size} color={color} />
    </div>
  );
};

export default Loader;
