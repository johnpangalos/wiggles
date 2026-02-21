import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setIdToken } from "@/utils";

export const Login = () => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [scriptLoaded, setScriptLoaded] = useState(
    typeof google !== "undefined"
  );

  useEffect(() => {
    if (scriptLoaded) return;
    const onLoad = () => setScriptLoaded(true);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [scriptLoaded]);

  useEffect(() => {
    if (!scriptLoaded || !buttonRef.current) return;

    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response) => {
        setIdToken(response.credential);
        navigate("/feed");
      },
    });

    google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      text: "signin_with",
    });
  }, [scriptLoaded, navigate]);

  return (
    <div className="h-full flex items-center justify-center">
      <div ref={buttonRef} />
    </div>
  );
};
