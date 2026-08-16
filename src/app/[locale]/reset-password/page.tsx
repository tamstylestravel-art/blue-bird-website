import { setRequestLocale } from "next-intl/server";
import ResetPasswordClient from "./ResetPasswordClient";

export function generateStaticParams() {
  return [{ locale: "th" }, { locale: "en" }];
}

export default function ResetPasswordPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return <ResetPasswordClient />;
}
