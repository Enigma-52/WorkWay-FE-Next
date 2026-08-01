import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WorkWay — Jobs Simplified",
    short_name: "WorkWay",
    description:
      "WorkWay helps you discover the right jobs faster. Browse thousands of opportunities, explore companies, and apply with confidence.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/logo.png",
        sizes: "800x800",
        type: "image/png",
      },
    ],
  };
}
