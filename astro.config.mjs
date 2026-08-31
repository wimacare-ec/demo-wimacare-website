import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const site = process.env.SITE_URL || "https://www.wimacare.jp";
const configuredBase = process.env.ASTRO_BASE || "/";
const base = configuredBase.endsWith("/") ? configuredBase : `${configuredBase}/`;

function prefixMarkdownPublicPaths() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === "image" && typeof node.url === "string" && node.url.startsWith("/")) {
        node.url = `${base}${node.url.slice(1)}`;
      }

      node.children?.forEach(visit);
    };

    visit(tree);
  };
}

export default defineConfig({
  site,
  base,
  markdown: { remarkPlugins: [prefixMarkdownPublicPaths] },
  output: "static",
  integrations: [sitemap()],
  build: { format: "directory" },
});
