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
  alt = "StudioSpace",
  href = "/",
}: BrandLogoProps) {
  let containerClasses = "";
  const defaultWidth = 1024;
  const defaultHeight = 682;
  let imgClasses = "object-contain";

  switch (variant) {
    case "navbar":
      containerClasses =
        "relative flex items-center justify-center p-1 rounded-xl transition-all duration-300";
      imgClasses =
        "h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]";
      break;

    case "compact":
      containerClasses =
        "relative flex items-center justify-center p-1 rounded-lg";
      imgClasses = "h-7 sm:h-8 w-auto object-contain";
      break;

    case "footer":
      containerClasses =
        "relative inline-flex items-center justify-start transition-all duration-300";
      imgClasses =
        "h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-105";
      break;

    case "auth":
      containerClasses =
        "relative w-44 h-28 sm:w-52 sm:h-32 mx-auto flex items-center justify-center p-1";
      imgClasses =
        "w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]";
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
