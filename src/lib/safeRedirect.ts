// Shared by AuthRedirectGate.tsx and the magic-link verify page: only ever
// follow our own relative paths from a `callbackUrl`/`authRedirect` query
// param, since that's untrusted input regardless of who set it.
//
// `//host` is protocol-relative (resolves to an external origin) and
// `/\host` is a known browser-normalization bypass — some browsers treat a
// leading backslash as a forward slash, turning `/\evil.com` into
// `//evil.com` after parsing. Both must be rejected, not just the first.
export function isSafeRedirectPath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//") || path.startsWith("/\\")) return false;
  return true;
}
