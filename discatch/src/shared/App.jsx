// LIBRARY
import React from "react";
import { ThemeProvider } from "styled-components";

// STYLE
import theme from "../shared/style";

//COMPONENTS
import { Router } from "../components";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  );
}

export default App;
