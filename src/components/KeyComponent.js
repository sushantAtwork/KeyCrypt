import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Typography, Box } from "@mui/joy";
import React from "react";

export default function KeyComponent({
  key_id,
  key_name,
  key_value,
  key_type,
  onClick
}) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e0f7fa",
        padding: "10px",
        marginTop : "10px",
        marginBottom: "10px",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box sx={{ flexShrink: 0, marginRight: "10px" }}>
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg"
          alt="Key"
          style={{ width: "80px", height: "80px", borderRadius: "4px" }}
        />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1" fontWeight="bold" color="text.primary">
          {key_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {key_value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {key_type}
        </Typography>
      </Box>
      <FontAwesomeIcon
        icon={faTrash}
        onClick={onClick}
        style={{
          cursor: "pointer",
          color: "#d32f2f", 
          fontSize: "24px",
        }}
        aria-label={`Delete key ${key_name}`} 
      />
    </Card>
  );
}
