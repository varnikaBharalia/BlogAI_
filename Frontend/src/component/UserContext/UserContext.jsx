import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [CurrentUser, setCurrentUser] = useState(null);
  const [AllBlogs, setAllBlogs] = useState([]);

  return (
    <UserContext.Provider value={{ CurrentUser, setCurrentUser, AllBlogs, setAllBlogs }}>
      {children}
    </UserContext.Provider>
  );
}

export default function UseUser() {
  return useContext(UserContext);
}
