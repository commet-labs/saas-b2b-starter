import { authLocales } from "@/modules/auth/lib/locales/en";
import { organizationLocales } from "@/modules/organization/lib/locales/en";
import { sharedLocales } from "@/modules/shared/lib/locales/en";
export default {
  ...authLocales,
  ...organizationLocales,
  ...sharedLocales,
} as const;
