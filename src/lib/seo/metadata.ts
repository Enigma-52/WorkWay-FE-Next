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

// The bundled default logo is a known 800x800 square. Arbitrary external
// images (job/company logos passed via `image`) have unknown real
// dimensions, so we don't claim width/height for those — a false claim
// causes social platforms to mis-crop/distort the preview. Both fields
// are optional per the OG spec; omitting them means the platform fetches
// the image and determines its own dimensions.
const DEFAULT_IMAGE = "/og.png";
const DEFAULT_IMAGE_DIMENSIONS = { width: 1200, height: 630 };

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  robots,
  keywords,
}: BuildMetadataArgs): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = path.startsWith("http")
    ? path
    : new URL(path, `${siteUrl}/`).toString();
  const resolvedImage = image || DEFAULT_IMAGE;
  const imageUrl = resolvedImage.startsWith("http")
    ? resolvedImage
    : new URL(resolvedImage, `${siteUrl}/`).toString();
  const imageMeta = image
    ? { url: imageUrl, alt: title }
    : { url: imageUrl, ...DEFAULT_IMAGE_DIMENSIONS, alt: title };

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
      images: [imageMeta],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
