"use client";
import { LAYOUT_OPTIONS } from "../../config/enums";

import { useLayout } from "../../hooks/use-layout";
import { useIsMounted } from "../../hooks/use-is-mounted";

import HydrogenLayout from "../../layouts/hydrogen/layout";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { layout } = useLayout();
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  if (layout === LAYOUT_OPTIONS.HYDROGEN) {
    return <HydrogenLayout>{children}</HydrogenLayout>;
  }

  return <HydrogenLayout>{children}</HydrogenLayout>;
}
