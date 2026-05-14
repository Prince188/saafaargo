import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchMe = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(res.data.user);
    } catch (err) {
      console.log("Auth error", err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);