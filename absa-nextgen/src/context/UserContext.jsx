import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}"),
  );

  // Sync to localStorage whenever user changes, like a "save" effect. This ensures that any updates to user state are persisted.
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // FIXED: Moved inside the component so it can access `user` and `setUser`
  const updateUser = (updates) => {
    // Always read the freshest/newest copy from localStorage so data written
    // directly (e.g. Register) is never shut down by a stale context state.
    const current = JSON.parse(localStorage.getItem("user") || "{}");
    const newUser = { ...current, ...updates };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  // FIXED: Added `updateUser` to the context value so useUser() shows it
  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook (clean usage)
export const useUser = () => useContext(UserContext);
