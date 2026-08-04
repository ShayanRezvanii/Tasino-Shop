"use client";

import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

/** Supports both static paths and uploaded data-URL images */
export default function ProductImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
  width,
  height,
}: Props) {
  const safeSrc = src || "/products/valve.svg";
  const isData = safeSrc.startsWith("data:");

  if (isData) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={safeSrc}
          alt={alt}
          className={`absolute inset-0 h-full w-full ${className || ""}`}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={safeSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={safeSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={safeSrc}
      alt={alt}
      width={width || 200}
      height={height || 200}
      className={className}
      priority={priority}
    />
  );
}
