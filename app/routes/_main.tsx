import type { Route } from "./+types/_main";
import { Outlet, redirect } from "react-router";
import { BottomNavigation } from "~/components/BottomNavigation";
import { BreakpointProvider } from "~/hooks/useBreakpoint";
import { createSessionStorage } from "~/lib/session.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const sessionStorage = createSessionStorage(env.SESSION_SECRET);
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  const email = session.get("email") as string | undefined;
  if (!email) {
    throw redirect("/login");
  }

  return {
    user: {
      email,
      name: (session.get("name") as string) ?? "",
      picture: (session.get("picture") as string) ?? "",
    },
  };
}

export default function MainLayout() {
  return (
    <BreakpointProvider>
      <div id="App" className="h-[100svh] overflow-hidden text-gray-800">
        <div className="flex flex-col w-full h-screen">
          <div className="flex-1 w-full overflow-y-auto overflow-x-hidden">
            <Outlet />
          </div>
          <BottomNavigation />
        </div>
      </div>
    </BreakpointProvider>
  );
}
