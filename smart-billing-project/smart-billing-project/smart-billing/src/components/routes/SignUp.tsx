import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthProvider";
import ErrorText from "../regular/ErrorText";
import FieldError from "../regular/FieldError";
import FieldInput from "../regular/FieldInput";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required."),
  email: Yup.string()
    .email("Invalid email format.")
    .required("Email is required."),
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password must contain 8 or more characters.")
    .matches(/.*[a-z].*/, "Password must contain at least 1 lower case letter.")
    .matches(/.*[A-Z].*/, "Password must contain at least 1 upper case letter.")
    .matches(/.*[0-9].*/, "Password must contain at least 1 number.")
    .matches(
      /.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~].*/,
      "Password must contain at least 1 special character"
    ),
  confirmationPassword: Yup.string()
    .required("Confirmation password is required.")
    .oneOf([Yup.ref("password")], "Your passwords do not match."),
});

function SignUp() {
  const { palette } = useTheme();
  const { signUp } = useAuth();
  const styles = {
    formControl: {
      marginTop: "16px",
      marginBottom: "16px",
    },
  };
  const onSubmit = useCallback(
    async (
      {
        name,
        email,
        password,
      }: {
        name: string;
        email: string;
        password: string;
      },
      formikBag: any
    ) => {
      try {
        await signUp({ name, email, password });
      } catch (e: any) {
        const errorToFieldMap = {
          EMAIL_REQUIRED: "email",
          PASSWORD_REQUIRED: "password",
          EMAIL_ALREADY_EXISTS: "email",
        };
        const error = e.response.data as unknown as {
          error: keyof typeof errorToFieldMap;
          message: string;
        };
        const field = errorToFieldMap[error.error];
        formikBag.setFieldError(field, error.message);
        console.log("error", e);
      }
    },
    [signUp]
  );
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
          minHeight: "500px",
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
            backgroundImage: "url('/images/regular/signup.png')",
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
            <Typography variant="h6">Sign Up Form</Typography>
          </div>
          <Formik
            initialValues={{
              email: "",
              name: "",
              password: "",
              confirmationPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form>
              <FieldInput name="name" label="Name" />
              <FieldInput name="email" label="Email" type="email" />
              <FieldInput name="password" label="Password" type="password" />
              <FieldInput
                name="confirmationPassword"
                label="Confirm Password"
                type="password"
              />
              <Typography variant="subtitle2">
                Are you a existing user? <Link to="/login">login</Link>
              </Typography>
              <div style={styles.formControl}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </div>
            </Form>
          </Formik>
        </Box>
      </Box>
    </Box>
  );
}

export default SignUp;
