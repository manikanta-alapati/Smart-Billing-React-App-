import {
  Grid,
  Box,
  Typography,
  Button,
  Modal,
  CircularProgress,
} from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";
import { useCallback, useReducer, useState } from "react";
import Webcam from "react-webcam";
import { useAuth } from "../../contexts/AuthProvider";
import { useAxiosProvider } from "../../contexts/AxiosProvider";
import { BillingItem } from "./billing.types";
import BillingCamera from "./BillingCamera";
import BillingTable from "./BillingTable";

interface State {
  billingItems: BillingItem[];
  imgSrc: string | null;
}

type Action =
  | {
      type: "ADD_LIST";
      payload: BillingItem[];
    }
  | {
      type: "ADD_ITEM";
      payload: BillingItem;
    }
  | {
      type: "SET_COUNT";
      payload: {
        id: string;
        count: number;
      };
    }
  | {
      type: "SET_IS_SELECTED";
      payload: {
        id: string;
        isSelected: boolean;
      };
    }
  | {
      type: "SET_IMG";
      payload: string | null;
    }
  | {
      type: "SET_STATE";
      payload: State;
    };

const initialState: State = {
  billingItems: [],
  imgSrc: null,
};

const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case "ADD_LIST":
      return { ...state, billingItems: action.payload };
    case "ADD_ITEM":
      return {
        ...state,
        billingItems: [...state.billingItems, action.payload],
      };
    case "SET_COUNT":
      return {
        ...state,
        billingItems: state.billingItems.map((item) => {
          if (item.id === action.payload.id) {
            if (
              isNaN(Number(action.payload.count)) ||
              action.payload.count <= 0
            ) {
              return { ...item, count: 0, isSelected: false };
            }
            return { ...item, count: action.payload.count, isSelected: true };
          }
          return item;
        }),
      };
    case "SET_IS_SELECTED":
      return {
        ...state,
        billingItems: state.billingItems.map((item) => {
          if (item.id === action.payload.id) {
            return { ...item, isSelected: action.payload.isSelected };
          }
          return item;
        }),
      };
    case "SET_IMG":
      return { ...state, imgSrc: action.payload, billingItems: [] };
    case "SET_STATE":
      return action.payload;
    default:
      return state;
  }
};

const BillingSection = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [{ billingItems, imgSrc }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const onImageSubmit = useCallback(async (imgSrc: string) => {
    try {
      // const response = await axiosInstance.post("/billing/detect", {
      //   image: imgSrc,
      // });
      setIsLoading(true);
      const response = await axios({
        baseURL: process.env.REACT_APP_BACKEND_DOMAIN,
        url: "/billing/detect",
        method: "post",
        data: {
          image: imgSrc,
        },
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        responseType: "json",
      });

      const { billing_items: billingItems, output_image: outputImage } =
        response.data as any;
      console.log("billing-items", billingItems, outputImage);
      dispatch({
        type: "SET_STATE",
        payload: {
          billingItems: billingItems.map(({ id, cost, name, count }: any) => ({
            id,
            name,
            unitCost: cost,
            isSelected: true,
            count,
          })),
          imgSrc: outputImage,
        },
      });
    } catch (e) {
      console.log("error", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const makeBilling = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios({
        baseURL: process.env.REACT_APP_BACKEND_DOMAIN,
        url: "/billing/make-billing",
        method: "post",
        data: {
          billing_items: billingItems.map(({ id, count }) => ({ id, count })),
        },
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        responseType: "json",
      });
      dispatch({
        type: "ADD_LIST",
        payload: [],
      });
      dispatch({ type: "SET_IMG", payload: null });
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }, [billingItems]);

  return (
    <>
      <Modal open={isLoading}>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Modal>
      <Container sx={{ display: "flex", marginTop: "20px" }}>
        <Box sx={{ flex: 1, marginRight: "20px" }}>
          <BillingTable
            makeBilling={makeBilling}
            billingItems={billingItems}
            dispatch={dispatch}
          />
        </Box>
        <BillingCamera
          onSubmit={onImageSubmit}
          imgSrc={imgSrc}
          setImgSrc={(imgSrc: string | null) =>
            dispatch({ type: "SET_IMG", payload: imgSrc })
          }
        />
      </Container>
    </>
  );
};

export default BillingSection;
