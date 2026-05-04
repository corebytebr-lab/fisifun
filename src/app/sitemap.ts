import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.PUBLIC_APP_URL ?? "https://fisifun.corebytecnologia.com";
  const now = new Date();
  const pages = ["", "/login"];
  return pages.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1.0 : 0.8,
  }));
}
