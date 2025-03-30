import type { Route } from "./+types/route";
import { SignInButton } from "./components/SignInButton";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const ALLOWED_EMAILS = "allowed-emails";

export async function loader({ context }: Route.LoaderArgs) {
  const emails = await context.cloudflare.env.WIGGLES.get(ALLOWED_EMAILS);
  return { emails };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { emails } = loaderData;
  console.log(emails);
  return <SignInButton />;
}
