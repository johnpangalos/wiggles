import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { startTransition } from "react";

startTransition(() => {
  hydrateRoot(document, <HydratedRouter />);
});
