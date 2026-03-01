import { HydratedRouter } from "react-router/dom";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { checkRegistration, register, unregister } from "@/register-sw";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});

// Register service worker on the client
async function registerSW() {
  await unregister();
  const registration = await checkRegistration();
  if (registration === undefined) await register();
}
registerSW();
