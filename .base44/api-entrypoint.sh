#!/bin/sh
# LibreChat requires CREDS_KEY as 64 hex chars and CREDS_IV as 32 hex chars.
# Base44-generated development placeholders are base64; derive hex from them.
# Values that are already valid hex are passed through untouched.
set -e
to_hex() {
  node -e '
    const [v, n] = [process.argv[1] || "", Number(process.argv[2])];
    if (new RegExp(`^[0-9a-fA-F]{${n}}$`).test(v)) { process.stdout.write(v); process.exit(0); }
    process.stdout.write(require("crypto").createHash("sha256").update(v).digest("hex").slice(0, n));
  ' "$1" "$2"
}
CREDS_KEY="$(to_hex "$CREDS_KEY" 64)"
CREDS_IV="$(to_hex "$CREDS_IV" 32)"
export CREDS_KEY CREDS_IV
exec "$@"
