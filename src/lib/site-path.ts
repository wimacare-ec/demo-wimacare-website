const rawBase = import.meta.env.BASE_URL;
const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

export const sitePath = (path = "/") => `${base}${path.replace(/^\//, "")}`;

export const withoutBase = (pathname: string) => {
  if (base === "/") return pathname;

  const normalizedBase = base.slice(0, -1);
  return pathname.startsWith(normalizedBase)
    ? pathname.slice(normalizedBase.length) || "/"
    : pathname;
};
