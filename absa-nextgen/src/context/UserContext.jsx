import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  // Sync to localStorage whenever user changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // FIX 1: Moved inside the component so it can access `user` and `setUser`
  const updateUser = (updates) => {
    // Always read the freshest copy from localStorage so data written
    // directly (e.g. Register) is never clobbered by a stale context state.
    const current = JSON.parse(localStorage.getItem("user") || "{}");
    const newUser = { ...current, ...updates };
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
