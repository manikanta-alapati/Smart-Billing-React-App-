import React, { FC, useContext, useMemo } from "react";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useAuth } from "./AuthProvider";

interface AxiosType {
  axiosInstance: AxiosInstance;
}

interface AxiosProviderType {
  children: React.ReactNode;
}

const Axios = React.createContext<AxiosType>({
  axiosInstance: axios.create({}),
});

const AxiosProvider: FC<AxiosProviderType> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  const value = useMemo(
    () => ({
      axiosInstance: axios.create({
        baseURL: process.env.REACT_APP_BACKEND_DOMAIN,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          Authorization: `Bearer ${
            isLoggedIn ? localStorage.getItem("jwt_token") : ""
          }`,
        },
        responseType: "json",
      }),
    }),
    [isLoggedIn]
  );
  return <Axios.Provider value={value}>{children}</Axios.Provider>;
};

export const useAxiosProvider = () => useContext(Axios);

interface UseQueryProps {
  requestConfig: AxiosRequestConfig;
}

interface UseQueryReturnType {}

// export const useQuery = ({ requestConfig }: UseQueryProps): UseQueryReturnType => {
//   const { axiosInstance } = useContext(Axios);
//   const [data, setData] =

//   return {};
// };

export default AxiosProvider;
