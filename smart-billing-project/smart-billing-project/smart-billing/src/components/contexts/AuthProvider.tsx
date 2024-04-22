import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginProps {
  email: string;
  password: string;
}

interface SignUpProps extends LoginProps {
  name: string;
}

interface AuthType {
  isLoggedIn: boolean;
  user: {
    id: number;
    email: string;
    name: string;
  } | null;
  logout: () => void;
  login: (props: LoginProps) => Promise<void>;
  signUp: (props: SignUpProps) => Promise<void>;
}

interface AuthProviderType {
  children: React.ReactNode;
}

const Auth = React.createContext<AuthType>({
  isLoggedIn: false,
  user: null,
  logout: () => {},
  login: async () => {},
  signUp: async () => {},
});

const AuthProvider: FC<AuthProviderType> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("jwt_token")
  );
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const previousPath = location.state?.fromPath || "/";

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios({
          url: "/user/profile",
          baseURL: process.env.REACT_APP_BACKEND_DOMAIN,
          method: "get",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
          responseType: "json",
        });
        setUser(response.data);
      } catch (e) {}
    };
    if (isLoggedIn) {
      getUserInfo();
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  const value = useMemo(
    () => ({
      isLoggedIn,
      user,
      login: async ({ email, password }: LoginProps) => {
        const response = await axios({
          url: "/auth/login",
          baseURL: process.env.REACT_APP_BACKEND_DOMAIN,
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
          data: {
            email,
            password,
          },
          responseType: "json",
        });
        setIsLoggedIn(true);
        localStorage.setItem("jwt_token", response.data.jwt_token);
        navigate(previousPath, { replace: true });
      },
      logout: () => {
        setIsLoggedIn(false);
        localStorage.removeItem("jwt_token");
        navigate("/login", { replace: true });
      },
      signUp: async ({ name, email, password }: SignUpProps) => {
        const response = await axios({
          url: "/auth/signup",
          baseURL: process.env.REACT_APP_BACKEND_DOMAIN,
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
          data: {
            name,
            email,
            password,
          },
          responseType: "json",
        });
        setIsLoggedIn(true);
        localStorage.setItem("jwt_token", response.data.jwt_token);
        navigate(previousPath, { replace: true });
      },
    }),
    [isLoggedIn, navigate, previousPath, user]
  );

  return <Auth.Provider value={value}>{children}</Auth.Provider>;
};

export const useAuth = () => useContext(Auth);

export default AuthProvider;
