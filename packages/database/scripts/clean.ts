import { db, schema } from "@repo/database/connection";
import { reset } from "drizzle-seed";

async function main() {
  await reset(db, schema);
  console.log("✅ Database cleaned successfully");
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Error cleaning database:", error);
  process.exit(1);
});
