import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

export interface CustomSnackbarProps {
  open: boolean;
  message: string;
  status?: AlertColor; // "success" | "error" | "info" | "warning"
  autoHideDuration?: number;
  onClose: () => void;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  message,
  status = "info",
  autoHideDuration = 3000,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={status}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
