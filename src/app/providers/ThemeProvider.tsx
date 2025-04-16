"use client";

import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material";
import { ReactNode } from "react";

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

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>;
}

// Export theme for use in other components
export { theme };
