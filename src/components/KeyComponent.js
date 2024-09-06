import { Card, Typography, Box } from "@mui/joy";
import React from "react";

export default function KeyComponent({
  key_id,
  key_name,
  key_value,
  key_type,
}) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "teal",
        padding: "10px",
      }}
    >
      <Box sx={{ backgroundColor: "yellow" }}>
        <img
          //   src={image}
          alt={"HHAHAH"}
          style={{ width: "100%", borderRadius: "4px" }}
          height={"140"}
          width={"140"}
        />
      </Box>
      <Box sx={{ backgroundColor: "pink", width: "100%" }}>
        <Typography>{key_name}</Typography>
        <Typography>{key_value}</Typography>
        <Typography>{key_type}</Typography>
      </Box>
    </Card>
  );
}
