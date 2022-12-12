import "./utils/polyfills";

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./components/App/App";
import { GalleryProvider } from "./hooks/GalleryContext";

const Root = () => (
  <GalleryProvider>
    <App />
  </GalleryProvider>
);

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
