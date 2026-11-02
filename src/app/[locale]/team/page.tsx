import React from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import TeamClient from "./TeamClient";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.bluebirdpicturesstudio.com";

const TEAM_HERO_IMAGE = "/images/team-hero-bg.webp";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Team" });

  const title = t("metaTitle");
  const description = t("metaDescription");

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    authors: [
      {
        name: "Blue Bird Pictures Studio",
        url: `${BASE_URL}/${locale}/team`,
      },
    ],
    publisher: "Blue Bird Pictures Studio",
    keywords: [
      "Blue Bird Pictures Studio",
      "Blue Bird Pictures Studio Team",
      "กฤศกร รัตนปทุมพงส์",
      "Kritsakorn Rattanapathumphong",
      "Wyatt Mitchell",
      "Ren Tanaka",
      "Blue Bird Composer Pro",
      "ทีมงาน Blue Bird",
      "นักพัฒนาซอฟต์แวร์",
      "โปรดักชั่นภาพยนตร์",
      "ซาวด์เอนจิเนียร์",
    ],
    alternates: {
      canonical: `/${locale}/team`,
      languages: {
        th: "/th/team",
        en: "/en/team",
        ja: "/ja/team",
      },
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/team`,
      siteName: "Blue Bird Pictures Studio",
      locale: locale === "th" ? "th_TH" : locale === "ja" ? "ja_JP" : "en_US",
      type: "website",
      images: [
        {
          url: TEAM_HERO_IMAGE,
          alt: "Blue Bird Pictures Studio Team & Visionaries",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [TEAM_HERO_IMAGE],
    },
  };
}

export default async function TeamPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const pageUrl = `${BASE_URL}/${locale}/team`;
  const founderUrl = `${BASE_URL}/${locale}/founder`;

  // โค้ด JSON-LD Schema Markup (@graph) สำหรับ AboutPage, Organization, Team Members & BreadcrumbList
  const structuredDataGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${pageUrl}#aboutpage`,
        url: pageUrl,
        name: "ทีมงาน Blue Bird Pictures Studio | Team & Visionaries",
        inLanguage: locale,
        description:
          "ทำความรู้จักทีมงานเบื้องหลัง Blue Bird Pictures Studio นำโดย กฤศกร รัตนปทุมพงส์ พร้อมทีมนักพัฒนาซอฟต์แวร์และโปรดักชั่นระดับสากล",
        mainEntity: {
          "@id": `${BASE_URL}/#organization`,
        },
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Blue Bird Pictures Studio",
        url: BASE_URL,
        logo: `${BASE_URL}/images/bird.png`,
        founder: {
          "@type": "Person",
          "@id": `${BASE_URL}/#kritsakorn-rattanapathumphong`,
          name: "กฤศกร รัตนปทุมพงส์",
          alternateName: "Kritsakorn Rattanapathumphong",
          jobTitle: "Founder, Film Producer & Lead Software Architect",
          url: founderUrl,
          sameAs: founderUrl,
        },
        employee: [
          {
            "@type": "Person",
            name: "กฤศกร รัตนปทุมพงส์",
            alternateName: "Kritsakorn Rattanapathumphong",
            jobTitle: "Founder, Film Producer & Lead Architect",
            url: founderUrl,
          },
          {
            "@type": "Person",
            name: "Wyatt Mitchell",
            alternateName: "ไวแอตต์ มิตเชลล์",
            jobTitle: "Co-Founder & Core Developer",
          },
          {
            "@type": "Person",
            name: "Ren Tanaka",
            alternateName: "เร็น ทานากะ",
            jobTitle: "Co-Developer",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${BASE_URL}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Team",
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredDataGraph),
        }}
      />
      <TeamClient />
    </>
  );
}
