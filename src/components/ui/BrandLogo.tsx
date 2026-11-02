"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface BrandLogoProps {
  variant?: "navbar" | "footer" | "auth" | "compact" | "custom";
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  alt?: string;
  href?: string | null;
}

/**
 * Official StudioSpace Brand Logo Component
 * Renders the official transparent 3D StudioSpace logo across Navbar, Auth & Footer
 * Preserves 1024x682 (1.5:1 / 3:2) aspect ratio without distortion or cropping.
 */
export function BrandLogo({
  variant = "navbar",
  width,
  height,
  className = "",
  imageClassName = "",
  priority = false,
  alt = "StudioSpace — Find, Book, Create",
  href = "/",
}: BrandLogoProps) {
  let containerClasses = "";
  const defaultWidth = 1024;
  const defaultHeight = 682;
  let imgClasses = "object-contain";

  switch (variant) {
    case "navbar":
      containerClasses =
        "relative flex items-center justify-center p-1 sm:p-1.5 rounded-xl bg-charcoal/90 dark:bg-transparent border border-white/10 dark:border-transparent group-hover:border-orange-brand/40 transition-all duration-300";
      imgClasses =
        "h-9 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]";
      break;

    case "compact":
      containerClasses =
        "relative flex items-center justify-center p-1 rounded-lg bg-charcoal/80 dark:bg-transparent border border-white/10 dark:border-transparent";
      imgClasses = "h-8 sm:h-9 w-auto object-contain";
      break;

    case "footer":
      containerClasses =
        "relative inline-flex items-center justify-start p-1.5 sm:p-2 rounded-2xl bg-black/40 border border-white/10 group-hover:border-orange-brand/40 transition-all duration-300";
      imgClasses =
        "h-11 sm:h-12 md:h-14 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105";
      break;

    case "auth":
      containerClasses =
        "relative w-48 h-32 sm:w-56 sm:h-36 mx-auto overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-glow flex items-center justify-center p-2 backdrop-blur-md";
      imgClasses =
        "w-full h-full object-contain transition-transform duration-300 group-hover:scale-105";
      break;

    case "custom":
    default:
      containerClasses = "relative flex items-center justify-center";
      imgClasses = "w-full h-full object-contain";
      break;
  }

  const finalContainerClasses = className ? `${containerClasses} ${className}` : containerClasses;
  const finalImageClasses = imageClassName ? `${imgClasses} ${imageClassName}` : imgClasses;

  const content = (
    <div className={finalContainerClasses}>
      <Image
        src="/assets/studiospace-logo.png"
        alt={alt}
        width={width || defaultWidth}
        height={height || defaultHeight}
        priority={priority || variant === "auth" || variant === "navbar"}
        className={finalImageClasses}
      />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-block group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-brand rounded-xl"
        aria-label={alt}
      >
        {content}
      </Link>
    );
  }

  return content;
}
