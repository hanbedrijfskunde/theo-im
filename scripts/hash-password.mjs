import { createHash } from "node:crypto";

const pw = process.argv[2];
if (!pw) {
  console.error("Gebruik: node scripts/hash-password.mjs <wachtwoord>");
  console.error("Plak de output als waarde van UNLOCK_HASH in app.js.");
  process.exit(1);
}
console.log(createHash("sha256").update(pw).digest("hex"));
