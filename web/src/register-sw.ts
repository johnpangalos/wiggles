// Check a service worker registration status
export async function checkRegistration() {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    return registration;
  }
}

// Registers a service worker
export async function register() {
  if ("serviceWorker" in navigator) {
    try {
      // Change the service worker URL to see what happens when the SW doesn't exist
      await navigator.serviceWorker.register("sw.js");
    } catch (error) {
      if (error instanceof Error)
        console.error("Error while registering: " + error.message);
    }
  }
}

// Unregister a currently registered service worker
export async function unregister() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const result = await registration.unregister();
        console.log(
          result
            ? "Service worker unregistered"
            : "Service worker couldn't be unregistered"
        );
      } else {
        console.log("There is no service worker to unregister");
      }
    } catch (error) {
      if (error instanceof Error)
        console.error("Error while unregistering: " + error.message);
    }
  } else {
    console.log("Service workers API not available");
  }
}
