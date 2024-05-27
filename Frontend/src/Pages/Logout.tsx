import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const Logout: React.FC = () => {
  const { setIsLoggedIn, setUsername, setEmail } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    setUsername(null);
    setIsLoggedIn(null);
    setEmail(null);

    navigate("/auth/sign-in");
  }, [navigate, setIsLoggedIn, setUsername, setEmail]);

  return null;
};

export default Logout;
