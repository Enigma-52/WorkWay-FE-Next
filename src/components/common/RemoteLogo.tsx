"use client";

import { useState } from "react";
import Image from "next/image";

type RemoteLogoProps = {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallback: React.ReactNode;
};

export default function RemoteLogo({
  src,
  alt,
  width,
  height,
  className,
  fallback,
}: RemoteLogoProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <>{fallback}</>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}

