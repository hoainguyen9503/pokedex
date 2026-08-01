import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import GiantsPage from "./GiantsPage";
import PokemonGroupsPage from "./PokemonGroupsPage";
import "./index.css";

function Root() {
  const [route, setRoute] = useState(() => window.location.hash);
  useEffect(() => {
    const sync = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  if (route.startsWith("#/giants") || route.startsWith("#/lol")) return <GiantsPage />;
  if (route.startsWith("#/pokemon-groups")) return <PokemonGroupsPage />;
  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
