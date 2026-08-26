import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import DashboardOverview from "./DashboardOverview";
import { Suspense } from "react";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function DashboardPage(props: { params: Promise<{ locale: string }> }) {
  const { params } = props;
  const { locale } = await params;
  
  setRequestLocale(locale);

  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
      <DashboardOverview />
    </Suspense>
  );
}
