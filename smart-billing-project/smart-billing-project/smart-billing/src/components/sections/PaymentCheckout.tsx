import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import FieldInput from "../regular/FieldInput";

const validationSchema = Yup.object({
  cardNumber: Yup.string().matches(
    /\d\d\d\d \d\d\d\d \d\d\d\d \d\d\d\d/,
    "Input should contain all numbers and be spaced."
  ),
  expiration: Yup.string().matches(/^\d\d\/\d\d$/, "MM/YY"),
  cvc: Yup.string().matches(/^\d\d\d\d?$/, "Should be 3 or 4 digits."),
});

const PaymentCheckout = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Formik
        initialValues={{
          cardNumber: "",
          expiration: "",
          cvc: "",
        }}
        validationSchema={validationSchema}
        onSubmit={() => navigate("/")}
      >
        {({ values }) => {
          console.log("values", values);
          return (
            <Form>
              <FieldInput name="cardNumber" label="Card Number" />
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <FieldInput
                  sx={{ flex: 1, marginRight: "10px" }}
                  name="expiration"
                  label="Expiration"
                  //   defaultValue={"MM/YY"}
                  value={
                    values.expiration.length > 2 &&
                    !values.expiration.includes("/")
                      ? values.expiration.slice(0, 2) +
                        "/" +
                        values.expiration.slice(2)
                      : values.expiration
                  }
                />
                <FieldInput
                  sx={{ flex: 1, marginLeft: "10px" }}
                  name="cvc"
                  label="CVC"
                />
              </Box>
              <Button variant="contained" color="success" type="submit">
                Pay Now
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default PaymentCheckout;
