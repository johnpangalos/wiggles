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

const url = generateLoginURL({
  redirectURL: "https://dev.wiggle-room.xyz/feed",
  domain: "https://johnpangalos.cloudflareaccess.com",
  aud: "",
});

export const Login = () => {
  window.location.replace(url);
  return <></>;
};
