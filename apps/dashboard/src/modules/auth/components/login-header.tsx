import { useScopedI18n } from "@/locales/client";

export function LoginHeader() {
  const t = useScopedI18n("login");

  return (
    <div className="text-center space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-sm text-muted-foreground">{t("description")}</p>
    </div>
  );
}
