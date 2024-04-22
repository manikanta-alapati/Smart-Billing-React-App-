import { TextField, TextFieldProps } from "@mui/material";
import { Field, FieldProps } from "formik";
import React, { FC } from "react";
import ErrorText from "./ErrorText";

const FieldInput: FC<TextFieldProps> = (props) => {
  const styles = {
    formControl: {
      marginBottom: "16px",
    },
  };
  return (
    <Field name={props.name}>
      {({ form, field, meta }: FieldProps) => {
        return (
          <div style={styles.formControl}>
            <TextField
              variant="outlined"
              fullWidth
              type="text"
              {...field}
              {...props}
            />
            {meta.touched && meta.error && <ErrorText>{meta.error}</ErrorText>}
          </div>
        );
      }}
    </Field>
  );
};

export default FieldInput;
