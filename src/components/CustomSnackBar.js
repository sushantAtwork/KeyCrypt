import React from "react";
import { Snackbar } from "@mui/joy";

export default function CustomSnackBar({ color, open, onClose, message }) {
  return (
    <Snackbar autoHideDuration={3500} anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} variant="solid" color={color} open={open} onClose={onClose}>
      {message}
    </Snackbar>
  );
}
