import React, { FC } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

type RequireAuthPropsType = {
  children: React.ReactNode;
};

const RequireAuth: FC<RequireAuthPropsType> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ fromPath: location.pathname }} />;
  }

  return <>{children}</>;
};

export default RequireAuth;
