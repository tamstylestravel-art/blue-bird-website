import React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PricingClient from "./PricingClient";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.bluebirdpicturesstudio.com";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const title =
    locale === "th"
      ? "ราคาและแพ็กเกจ"
      : locale === "ja"
      ? "料金プラン"
      : "Pricing & Plans";
  const description =
    locale === "th"
      ? "เลือกแพ็กเกจ Blue Bird Composer Pro ที่เหมาะกับการทำงานของคุณ เพื่อเพิ่มประสิทธิภาพในการตัดต่อวิดีโอ"
      : locale === "ja"
      ? "動画編集ワークフローに最適な Blue Bird Composer Pro のサブスクリプションプランを選択してください。"
      : "Choose the Blue Bird Composer Pro subscription plan that fits your video editing workflow.";

  return {
    metadataBase: new URL(BASE_URL),
    title: `${title} | Blue Bird Pictures Studio`,
    description,
    alternates: {
      canonical: `/${locale}/pricing`,
      languages: {
        th: "/th/pricing",
        en: "/en/pricing",
        ja: "/ja/pricing",
      },
    },
    openGraph: {
      title: `${title} | Blue Bird Pictures Studio`,
      description,
      url: `${BASE_URL}/${locale}/pricing`,
      siteName: "Blue Bird Pictures Studio",
      locale: locale === "th" ? "th_TH" : locale === "ja" ? "ja_JP" : "en_US",
      type: "website",
    },
  };
}

export default async function PricingPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <PricingClient />;
}
