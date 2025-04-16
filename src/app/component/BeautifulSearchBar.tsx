"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography, Snackbar, Alert } from "@mui/material";
import { CloudDownloadRounded } from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans)",
  },
});

export default function BeautifulSearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const generatePDF = (event: React.FormEvent) => {
    event.preventDefault();
    const targetUrl = `https://${searchTerm}`;

    setLoading(true);
    fetch("/api/hello", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: targetUrl }),
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          return response.json().then((error) => {
            throw new Error(error.error);
          });
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = ".pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error.message);
        setSnackbarMessage(error.message || "An unknown error occurred.");
        setSnackbarOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      {loading && (
        <div
          style={{
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
        </div>
      )}

      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        minHeight="20vh"
        p={3}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#1976d2",
            fontWeight: 400,
            fontSize: {
              xs: "1.6rem",
              sm: "2.125rem",
            },
            marginBottom: {
              xs: "12px",
              sm: "24px",
            },
          }}
        >
          Convert Webpage To PDF
        </Typography>

        <Paper
          component="form"
          onSubmit={generatePDF}
          sx={{
            p: "4px 8px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: 450,
            borderRadius: "50px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.12)",
            },
            "&:focus-within": {
              boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.15)",
              border: `1px solid ${theme.palette.primary.main}`,
            },
          }}
          elevation={0}
        >
          <TextField
            sx={{
              ml: 1,
              flex: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
              "& .MuiInputBase-input": {
                padding: "12px 0",
                fontSize: "1rem",
              },
            }}
            placeholder="Ex: www.test.com"
            inputProps={{ "aria-label": "search query" }}
            value={searchTerm}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          />

          <IconButton
            type="submit"
            sx={{
              p: "10px",
              color: "primary.main",
            }}
            aria-label="search"
            disabled={loading}
          >
            <CloudDownloadRounded />
          </IconButton>
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
