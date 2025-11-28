export const getSiteUrl = (path: string = "") => {
  // Check for NEXT_PUBLIC_BASE_URL first
  let url =
    process.env.NEXT_PUBLIC_BASE_URL ?? // Set this to your site URL in production env.
    process.env.NEXT_PUBLIC_SITE_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";

  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;

  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

  path = path.replace(/^\/+/, "");

  return path ? `${url}${path}` : url;
};
