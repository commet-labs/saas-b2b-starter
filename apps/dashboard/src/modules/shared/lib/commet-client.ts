import { env } from "@/env";
import { Commet } from "commet";

/**
 * Commet client instance for managing customers and billing
 */
export const commet = new Commet({
  apiKey: env.COMMET_API_KEY,
  environment: "sandbox",
});
