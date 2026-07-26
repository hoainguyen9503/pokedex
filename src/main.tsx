import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import LolPage from "./LolPage";
import "./index.css";

function Root() {
  const [isLol, setIsLol] = useState(() => window.location.hash.startsWith("#/lol"));
  useEffect(() => {
    const sync = () => setIsLol(window.location.hash.startsWith("#/lol"));
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  return isLol ? <LolPage /> : <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
