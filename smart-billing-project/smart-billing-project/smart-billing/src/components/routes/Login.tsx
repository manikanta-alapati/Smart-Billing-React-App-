import { Box, Button, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider";
import * as Yup from "yup";
import { Formik, Form, FormikBag, FormikHelpers } from "formik";
import FieldInput from "../regular/FieldInput";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format.")
    .required("Email is required."),
  password: Yup.string().required("Password is required."),
});

export interface Values {
  email: string;
  password: string;
}

function Login() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard/billing");
    }
  }, [isLoggedIn, navigate]);
  const styles = {
    formControl: {
      marginTop: "16px",
      marginBottom: "16px",
    },
  };
  const onSubmit = async ({ email, password }: Values, formikBag: any) => {
    try {
      await login({ email, password });
    } catch (e: any) {
      const errorToFieldMap = {
        INVALID_EMAIL: "email",
        INVALID_PASSWORD: "password",
      };
      const error = e.response.data as unknown as {
        error: keyof typeof errorToFieldMap;
        message: string;
      };
      const field = errorToFieldMap[error.error];
      formikBag.setFieldError(field, error.message);

      console.log("error", e);
    }
  };
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "primary.main",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "800px",
          height: "500px",
          boxShadow: 2,
          backgroundColor: "white",
          padding: "20px",
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: "url('/images/regular/login.png')",
            backgroundSize: "contain",
            backgroundPosition: "50%",
            backgroundRepeat: "no-repeat",
          }}
        ></Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div style={styles.formControl}>
            <Typography variant="h6">Login Form</Typography>
          </div>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ setFieldError }) => {
              return (
                <Form>
                  <FieldInput name="email" label="Email" type="email" />
                  <FieldInput
                    name="password"
                    label="Password"
                    type="password"
                  />
                  <Typography variant="subtitle2">
                    Are you a new user? <Link to="/signup">signup</Link>
                  </Typography>
                  <div style={styles.formControl}>
                    <Button type="submit" variant="contained" color="primary">
                      Submit
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
