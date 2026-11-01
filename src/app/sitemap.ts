import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bluebirdpicturesstudio.com";

const LOCALES = ["th", "en", "ja"] as const;

const PUBLIC_PATHS = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/founder", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/team", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/terms", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.5, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return PUBLIC_PATHS.flatMap(({ path, priority, changeFrequency }) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          th: `${BASE_URL}/th${path}`,
          en: `${BASE_URL}/en${path}`,
          ja: `${BASE_URL}/ja${path}`,
        },
      },
    }))
  );
}

