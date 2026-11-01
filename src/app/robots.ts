import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.bluebirdpicturesstudio.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",
          "/*/dashboard/",
          "/*/plugin-auth/",
          "/*/reset-password/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

