import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import ProfileSettings from "@/components/dashboard/ProfileSettings";

export default async function SettingsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { params } = props;
  const { locale } = await params;
  
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Dashboard" });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">{t("settings")}</h1>
        <p className="text-gray-500 mt-2">
          จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ
        </p>
      </div>

      <div className="mt-8">
        <ProfileSettings />
      </div>
    </div>
  );
}
