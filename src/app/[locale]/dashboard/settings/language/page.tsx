import { setRequestLocale } from "next-intl/server";
import LanguageSettings from "./LanguageSettings";

export default async function LanguageSettingsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { params } = props;
  const { locale } = await params;
  
  setRequestLocale(locale);

  return <LanguageSettings />;
}
