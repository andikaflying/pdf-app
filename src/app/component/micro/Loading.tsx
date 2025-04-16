import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

export default function Loading() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "var(--font-geist-sans)",
      }}
    >
      <CircularProgress style={{ color: "#fff" }} />
      <Typography
        variant="h6"
        style={{
          color: "#fff",
          marginLeft: "16px",
        }}
      >
        Generating PDF...
      </Typography>
    </Box>
  );
}
