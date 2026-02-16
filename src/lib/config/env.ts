type RequiredServerVar = "BACKEND_API_URL";

function getServerEnv(name: RequiredServerVar): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  BACKEND_API_URL: getServerEnv("BACKEND_API_URL"),
  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};
