// import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MantineProvider } from "@mantine/core";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <StrictMode>
    <MantineProvider
      withGlobalStyles 
      withNormalizeCSS 
      theme={{
        breakpoints: {
          xs: '30em',
          sm: '48em',
          md: '64em',
          lg: '74em',
          xl: '90em',
        },
      }}
    >
      <App />
    </MantineProvider>
  // </StrictMode>
);
