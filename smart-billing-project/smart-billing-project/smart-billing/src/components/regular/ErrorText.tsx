import { Typography, useTheme } from "@mui/material";
import { FC } from "react";

const ErrorText: FC<{ children: string | number }> = ({ children }) => {
  const { palette } = useTheme();
  return (
    <Typography variant="subtitle1" color={palette.error.main}>
      {children}
    </Typography>
  );
};

export default ErrorText;
