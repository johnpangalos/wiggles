export function getExtenstion(filename: string) {
  return filename.split(".").pop();
}

export const generateLoginURL = ({
  redirectURL: redirectURLInit,
  domain,
  aud,
}: {
  redirectURL: string | URL;
  domain: string;
  aud: string;
}): string => {
  const redirectURL =
    typeof redirectURLInit === "string"
      ? new URL(redirectURLInit)
      : redirectURLInit;
  const { host } = redirectURL;
  const loginPathname = `/cdn-cgi/access/login/${host}?`;
  const searchParams = new URLSearchParams({
    kid: aud,
    redirect_url: redirectURL.pathname + redirectURL.search,
  });
  return new URL(loginPathname + searchParams.toString(), domain).toString();
};

export const loginUrl = generateLoginURL({
  redirectURL: import.meta.env.VITE_REDIRECT_URL,
  domain: "https://johnpangalos.cloudflareaccess.com",
  aud: import.meta.env.VITE_AUDIENCE,
});
