import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import SettingsTabs from "./SettingsTabs";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SettingsLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children, params } = props;
  const { locale } = await params;
  
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Dashboard" });

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">{t("settings")}</h1>
        <p className="text-gray-500">
          {t("settingsDesc", { defaultMessage: "Manage your personal information and account settings." })}
        </p>
      </div>

      <SettingsTabs />

      <div className="flex-1 w-full flex justify-center mt-8">
        <div className="w-full max-w-3xl">
          {children}
        </div>
      </div>
    </div>
  );
}
