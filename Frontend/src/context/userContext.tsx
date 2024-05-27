import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface UserContextType {
  isLoggedIn: string | null;
  setIsLoggedIn: Dispatch<SetStateAction<string | null>>;
  username: string | null;
  setUsername: Dispatch<SetStateAction<string | null>>;
  email: string | null;
  setEmail: Dispatch<SetStateAction<string | null>>;
}

export const UserContext = createContext<UserContextType>({
  isLoggedIn: null,
  setIsLoggedIn: () => {},
  username: null,
  setUsername: () => {},
  email: null,
  setEmail: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<string | null>(
    JSON.parse(localStorage.getItem("token") || "false")
  );
  const [username, setUsername] = useState<string | null>(
    JSON.parse(localStorage.getItem("username") || "null")
  );
  const [email, setEmail] = useState<string | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    localStorage.setItem("token", JSON.stringify(isLoggedIn));
    localStorage.setItem("username", JSON.stringify(username));
    localStorage.setItem("user", JSON.stringify(email));
  }, [isLoggedIn, username, email]);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        username,
        setUsername,
        email,
        setEmail,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
