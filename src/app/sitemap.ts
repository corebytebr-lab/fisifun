import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.PUBLIC_APP_URL ?? "https://fisifun.corebytecnologia.com";
  const now = new Date();
  const pages: Array<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" | "daily" }> = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/precos", priority: 0.9, changeFrequency: "weekly" },
    { path: "/sobre", priority: 0.8, changeFrequency: "monthly" },
    { path: "/duvidas-frequentes", priority: 0.8, changeFrequency: "monthly" },
    { path: "/login", priority: 0.6, changeFrequency: "weekly" },
    { path: "/termos", priority: 0.3, changeFrequency: "monthly" },
    { path: "/privacidade", priority: 0.3, changeFrequency: "monthly" },
  ];
  return pages.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
