import { useRouteError } from "react-router";

export {
  Profile as Component,
  profileLoader as loader,
  profileAction as action,
} from "@/pages/Profile";

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  return (
    <div className="h-full flex flex-col p-6 overflow-auto">
      <h1 className="text-xl font-bold text-red-600 mb-2">
        Something went wrong
      </h1>
      <p className="text-gray-800 mb-4">{error?.message ?? String(error)}</p>
      {error?.stack && (
        <pre className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-100 p-4 rounded overflow-auto">
          {error.stack}
        </pre>
      )}
    </div>
  );
}
