import { ErrorMessage, ErrorMessageProps } from "formik";
import { FC } from "react";
import ErrorText from "./ErrorText";

const FieldError: FC<ErrorMessageProps> = (props) => {
  return (
    <ErrorMessage {...props}>
      {(errorMsg) => <ErrorText>{errorMsg}</ErrorText>}
    </ErrorMessage>
  );
};

export default FieldError;
