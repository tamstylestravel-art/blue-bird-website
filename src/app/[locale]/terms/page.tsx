import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Terms" });
  return {
    title: t("title") + " | Blue Bird Pictures Studio",
  };
}

export default async function TermsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Terms" });

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundImage: "url('/images/User_requesting_cloud.webp')" }}>
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-brand-blue)] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-brand-purple)] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

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
            <section>
              <p>
                <strong>ข้อตกลงและเงื่อนไขการใช้งานโปรแกรม (End User License Agreement)</strong>
              </p>
              <p className="mt-4">
                โปรแกรม <strong>Blue Bird Composer</strong> ("โปรแกรม") ถูกพัฒนาขึ้นโดย กฤศกร รัตนปทุมพงศ์ (Blue Bird Pictures Studio)
              </p>
              <p className="mt-4 text-[var(--color-brand-blue)] font-semibold">
                โปรดอ่านข้อตกลงด้านล่างนี้ก่อนทำการติดตั้ง
              </p>
            </section>

            <section className="bg-black/5 p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-3 text-[var(--color-brand-blue)]">สิทธิ์การใช้งาน</h2>
              <p>อนุญาตให้ลูกค้าที่สั่งซื้อโปรแกรมนี้อย่างถูกต้องตามลิขสิทธิ์ สามารถติดตั้งและใช้งานโปรแกรมนี้เพื่อสร้างสรรค์ผลงานได้</p>
            </section>

            <section className="bg-black/5 p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-3 text-red-500">ข้อห้าม</h2>
              <p>ห้ามมิให้ผู้ใด ทำซ้ำ ดัดแปลง แก้ไข วิศวกรรมย้อนกลับ (Reverse Engineering) หรือนำโปรแกรมนี้ไปแจกจ่าย ส่งต่อ แจกฟรี หรือนำไปขายต่อเพื่อแสวงหาผลกำไร โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษรจากผู้พัฒนา</p>
            </section>

            <section className="bg-black/5 p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-3 text-[var(--color-brand-blue)]">ความเป็นเจ้าของลิขสิทธิ์</h2>
              <p>ซอฟต์แวร์ โค้ด เครื่องมือ และการออกแบบหน้าตาโปรแกรม (UI) เป็นทรัพย์สินทางปัญญาของ Blue Bird Pictures Studio และผู้พัฒนาแต่เพียงผู้เดียว</p>
            </section>

            <section className="bg-black/5 p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-3 text-[var(--color-brand-blue)]">ข้อจำกัดความรับผิดชอบ</h2>
              <p>โปรแกรมนี้ให้บริการ "ตามสภาพ" (As is) ผู้พัฒนาจะไม่รับผิดชอบต่อความสูญเสียของข้อมูล หรือความเสียหายใดๆ ที่อาจเกิดขึ้นจากการใช้งานโปรแกรมนี้อย่างไม่ถูกต้อง</p>
            </section>

            <section className="bg-black/5 p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-3 text-orange-500">ความรับผิดชอบต่อไฟล์สื่อและลิขสิทธิ์ (Copyright & Third-Party Assets)</h2>
              <p>ผู้พัฒนาไม่มีส่วนเกี่ยวข้องและจะไม่รับผิดชอบทางกฎหมายใดๆ ทั้งสิ้น ต่อการที่ผู้ใช้งานนำไฟล์เสียง เพลง หรือสื่อใดๆ ที่ละเมิดลิขสิทธิ์ (ไฟล์เถื่อน) หรือไม่ได้รับอนุญาตอย่างถูกต้อง เข้ามาใช้งานร่วมกับโปรแกรมนี้ ผู้ใช้งานจะต้องรับผิดชอบต่อผลกระทบทางกฎหมายของไฟล์สื่อที่ตนเองนำมาใช้งานแต่เพียงผู้เดียว</p>
            </section>

            <section className="bg-black/5 p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-3 text-[var(--color-brand-blue)]">การยกเลิกสิทธิ์การใช้งาน (Termination)</h2>
              <p>ผู้พัฒนาขอสงวนสิทธิ์ในการยกเลิกหรือระงับสิทธิ์การใช้งานโปรแกรมของท่านทันที หากตรวจสอบพบว่าท่านละเมิดข้อตกลงใดๆ ในเอกสารฉบับนี้ (เช่น นำโปรแกรมไปแจกจ่ายหรือขายต่อ) โดยไม่จำเป็นต้องแจ้งให้ทราบล่วงหน้าและจะไม่มีการคืนเงินในทุกกรณี</p>
            </section>

            <section className="bg-black/5 p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-3 text-[var(--color-brand-blue)]">การอัปเดตและการให้บริการ (Updates & Support)</h2>
              <p>ผู้พัฒนาอาจมีการปล่อยอัปเดตเพื่อปรับปรุงประสิทธิภาพของโปรแกรมตามความเหมาะสม แต่ไม่ได้รับประกันว่าจะมีการอัปเดตตลอดชีพ (Lifetime) การให้บริการช่วยเหลือ (Support) จะเป็นไปตามขอบเขตและเงื่อนไขที่บริษัทกำหนดเท่านั้น</p>
            </section>

            <div className="mt-12 pt-8 border-t border-[var(--border)] text-center">
              <p className="font-semibold text-[var(--foreground)] mb-4">
                หากท่านกดยอมรับข้อตกลงและทำการติดตั้ง ถือว่าท่านได้รับทราบและยินยอมตามเงื่อนไขทั้งหมดที่ระบุไว้ข้างต้น
              </p>
              <p className="text-gray-500 text-sm">© 2026 Blue Bird Pictures Studio. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
