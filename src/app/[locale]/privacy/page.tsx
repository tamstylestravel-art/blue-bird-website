import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  return {
    title: t("title") + " | Blue Bird Pictures Studio",
  };
}

export default async function PrivacyPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Privacy" });

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundImage: "url('/images/User_requesting_cloud.webp')" }}>
      {/* Background Decorators */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-brand-blue)] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-brand-purple)] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center text-[var(--color-brand-blue)] hover:underline mb-8 transition-all font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t("back")}
        </Link>

        <div className="bg-[var(--surface)]/95 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-[var(--border)] shadow-xl animate-fade-in-up">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">{t("title")}</h1>
            <p className="text-gray-500">อัปเดตล่าสุด: สิงหาคม 2026</p>
          </div>

          <div className="space-y-8 text-[var(--foreground)] leading-relaxed">
            <section className="bg-black/5 p-6 rounded-2xl text-center">
              <p className="text-lg text-gray-500">
                ขณะนี้เรากำลังจัดทำนโยบายความเป็นส่วนตัว (Privacy Policy) ฉบับสมบูรณ์<br/>
                กรุณากลับมาตรวจสอบอีกครั้งในภายหลัง
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-[var(--border)] text-center">
              <p className="text-gray-500 text-sm">© 2026 Blue Bird Pictures Studio. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
