import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import AuthGuard from "@/components/dashboard/AuthGuard";
import Sidebar from "@/components/dashboard/Sidebar";
import { DashboardThemeProvider } from "@/components/dashboard/DashboardThemeProvider";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function DashboardLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children, params } = props;
  const { locale } = await params;
  
  setRequestLocale(locale);

  return (
    <AuthGuard>
      <DashboardThemeProvider>
        <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8 md:p-12">
            {children}
          </main>
        </div>
      </DashboardThemeProvider>
    </AuthGuard>
  );
}
