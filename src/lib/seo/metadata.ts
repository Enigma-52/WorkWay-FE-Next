import type { Metadata } from "next";

const DEFAULT_SITE_URL = "https://www.workway.dev";

type BuildMetadataArgs = {
  title: string;
  description: string;
  path: string;
  image?: string;
  robots?: Metadata["robots"];
  keywords?: Metadata["keywords"];
};

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  const trimmed = raw.trim();
  if (!trimmed) return DEFAULT_SITE_URL;
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, "");
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = "/logo.png",
  robots,
  keywords,
}: BuildMetadataArgs): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = path.startsWith("http")
    ? path
    : new URL(path, `${siteUrl}/`).toString();
  const imageUrl = image.startsWith("http")
    ? image
    : new URL(image, `${siteUrl}/`).toString();

  return {
    title,
    description,
    keywords,
    robots: robots ?? { index: true, follow: true },
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "WorkWay",
      type: "website",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
