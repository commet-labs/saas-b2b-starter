import { authLocales } from "@/modules/auth/lib/locales/es";
import { organizationLocales } from "@/modules/organization/lib/locales/es";
export default {
  ...organizationLocales,
  ...authLocales,
} as const;
