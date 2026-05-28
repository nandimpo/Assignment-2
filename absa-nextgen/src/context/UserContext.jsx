import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  // Load from localStorage once
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

  // Sync to localStorage whenever user changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // FIX 1: Moved inside the component so it can access `user` and `setUser`
  const updateUser = (updates) => {
    const newUser = { ...user, ...updates };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  // FIX 2: Added `updateUser` to the context value so useUser() exposes it
  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook (clean usage)
export const useUser = () => useContext(UserContext);
