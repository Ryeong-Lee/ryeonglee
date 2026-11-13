import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/gelasio/400.css";
import "@fontsource/gelasio/500.css";
import "@fontsource/gelasio/500-italic.css";
import "@fontsource-variable/inter";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
