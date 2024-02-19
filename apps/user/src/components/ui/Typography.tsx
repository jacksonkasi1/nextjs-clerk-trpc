"use client";

//  ** import core packages:
import React, { FC, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ** import third party:
import { motion as m, Variants } from "framer-motion";
import { cn } from "@/utils";

type TypographyVariant =
  | "Bold_H1"
  | "Bold_H2"
  | "Bold_H3"
  | "Bold_H4"
  | "Bold_H5"
  | "Bold_H6"
  | "Bold_H7"
  | "SemiBold_H1"
  | "SemiBold_H2"
  | "SemiBold_H3"
  | "SemiBold_H4"
  | "SemiBold_H5"
  | "SemiBold_H6"
  | "SemiBold_H7"
  | "Medium_H1"
  | "Medium_H2"
  | "Medium_H3"
  | "Medium_H4"
  | "Medium_H5"
  | "Medium_H6"
  | "Medium_H7"
  | "Regular_H1"
  | "Regular_H2"
  | "Regular_H3"
  | "Regular_H4"
  | "Regular_H5"
  | "Regular_H6"
  | "Regular_H7";

type TypographyAnimation = "move" | "underline" | "";

type LinkDirection = "forward" | "back";

interface TypographyProps {
  mVariants?: Variants;
  mDelay?: number;
  variant: TypographyVariant;
  children: ReactNode;
  className?: string;
  maxLines?: number;
  navigate?: LinkDirection;
  link?: string;
  target?: string;
  animate?: TypographyAnimation;
  disableSelect?: boolean;
  onClick?: () => void;
  labelColor?: string;
}

const Typography: FC<TypographyProps> = ({
  mVariants,
  mDelay = 0,
  variant,
  children,
  className = "",
  maxLines = 0,
  navigate,
  link = "",
  target = "",
  animate = "",
  disableSelect = false,
  labelColor,
  onClick,
  ...props
}) => {
  if (!variant) {
    throw new Error("variant is required");
  }

  const getClassName = (): string => {
    switch (variant) {
      // 700
      case "Bold_H1":
        return "font-bold text-[40px] md:text-[62px]";
      case "Bold_H2":
        return "font-bold text-[32px] md:text-[49px]";
      case "Bold_H3":
        return "font-bold text-[24px] md:text-[39px]";
      case "Bold_H4":
        return "font-bold text-[20px] md:text-[25px]";
      case "Bold_H5":
        return "font-bold text-[16px] md:text-[20px]";
      case "Bold_H6":
        return "font-bold text-[14px] md:text-[16px]";
      case "Bold_H7":
        return "font-bold text-[14px]";

      // 600
      case "SemiBold_H1":
        return "font-semibold text-[40px] md:text-[62px]";
      case "SemiBold_H2":
        return "font-semibold text-[32px] md:text-[49px]";
      case "SemiBold_H3":
        return "font-semibold text-[24px] md:text-[39px]";
      case "SemiBold_H4":
        return "font-semibold text-[20px] md:text-[25px]";
      case "SemiBold_H5":
        return "font-semibold text-[16px] md:text-[20px]";
      case "SemiBold_H6":
        return "font-semibold text-[14px] md:text-[16px]";
      case "SemiBold_H7":
        return "font-semibold text-[14px]";

      // 500
      case "Medium_H1":
        return "font-medium text-[40px] md:text-[62px]";
      case "Medium_H2":
        return "font-medium text-[32px] md:text-[49px]";
      case "Medium_H3":
        return "font-medium text-[24px] md:text-[39px]";
      case "Medium_H4":
        return "font-medium text-[20px] md:text-[25px]";
      case "Medium_H5":
        return "font-medium text-[16px] md:text-[20px]";
      case "Medium_H6":
        return "font-medium text-[14px] md:text-[16px]";
      case "Medium_H7":
        return "font-medium text-[10px] md:text-[14px]";

      // 400
      case "Regular_H1":
        return "font-normal text-[40px] md:text-[62px]";
      case "Regular_H2":
        return "font-normal text-[32px] md:text-[49px]";
      case "Regular_H3":
        return "font-normal text-[24px] md:text-[39px]";
      case "Regular_H4":
        return "font-normal text-[20px] md:text-[25px]";
      case "Regular_H5":
        return "font-normal text-[16px] md:text-[20px]";
      case "Regular_H6":
        return "font-normal text-[14px] md:text-[16px]";
      case "Regular_H7":
        return "font-normal text-[14px]";

      default:
        return "font-normal text-[14px]";
    }
  };

  const fontTypes = getClassName();

  const lineClampClass =
    maxLines > 0 ? `line-clamp-${maxLines?.toString()}` : "whitespace-normal";

  const getAnimationClass = (): string => {
    switch (animate) {
      case "move":
        return "hover:ml-1.5 transition-all duration-300";
      case "underline":
        return "hover:underline transition-all duration-300";
      default:
        return "";
    }
  };

  const animationClass = getAnimationClass();

  const router = useRouter();

  const handleNavigate = (): void => {
    if (navigate === "back") {
      router.back();
    } else {
      // Replace the following line with the correct route you want to navigate to
      router.forward();
    }
  };

  const defaultClass =
    "font-poppins text-primary-text tracking-normal leading-normal overflow-wrap overflow-hidden";

  const content = (
    <m.span
      initial="hidden"
      whileInView="visible"
      variants={mVariants}
      transition={{ duration: 0.6, ease: "easeIn", delay: mDelay }}
      viewport={{ once: true }}
      className={cn(
        fontTypes,
        lineClampClass,
        animationClass,
        defaultClass,
        className,
      )}
      style={{ userSelect: disableSelect ? "none" : "auto", color: labelColor }}
      {...props}
      onClick={() => {
        if (onClick) {
          onClick();
        }
        if (navigate) {
          handleNavigate();
        }
      }}
    >
      {children}
    </m.span>
  );

  return link ? (
    <Link
      href={link}
      target={target}
      className="text-light_dark_ dark:text-text_dark max-w-fit"
    >
      {content}
    </Link>
  ) : (
    content
  );
};

export default Typography;
