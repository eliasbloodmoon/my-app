import { createContext, useState } from "react";

export const UserContext = createContext({
  email: "",
  setEmail: () => {},
});

export function UserProvider({ children }) {
  const [email, setEmail] = useState("");

  return (
    <UserContext.Provider value={{ email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
}