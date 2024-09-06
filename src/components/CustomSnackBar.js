import React from "react";
import { Snackbar } from "@mui/joy";

export default function CustomSnackBar({ color, open, onClose, message }) {
  return (
    <Snackbar variant="soft" color={color} open={open} onClose={onClose}>
      {message}
    </Snackbar>
  );
}
