import React, { useEffect, useState } from "react";
import { Loading } from "@/components";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn } = useAuth();

  const state = location.state as { from?: { pathname?: string } };
  const from = state?.from?.pathname || "/feed";

  useEffect(() => {
    if (user === null || user === undefined) return;
    navigate(from, { replace: true });
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    signIn();
  }

  if (loading || user === undefined)
    return (
      <div className="flex flex-col items-center flex-grow h-full w-full">
        <Loading />
      </div>
    );

  if (user === null)
    return (
      <form
        className="flex justify-center items-center h-full w-full px-5 bg-gray-600"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col bg-gray-100 p-4 sm:w-64 w-full shadow">
          <div className="font-bold text-2xl pb-2">Please Login</div>
          <div className="text-xl pb-6">
            Right now only Google login is supported.
          </div>
          <button className="flex items-baseline bg-red-400 py-2 text-xl text-white">
            <div>Login with Google</div>
          </button>
        </div>
      </form>
    );

  return <></>;
};
