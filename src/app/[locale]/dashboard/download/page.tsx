import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import DashboardDownload from "./DashboardDownload";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function DownloadPage(props: { params: Promise<{ locale: string }> }) {
  const { params } = props;
  const { locale } = await params;
  
  setRequestLocale(locale);

  return <DashboardDownload />;
}
