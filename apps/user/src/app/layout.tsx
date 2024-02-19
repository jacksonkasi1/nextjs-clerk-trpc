import type { Metadata } from 'next';

import { ClerkProvider } from '@clerk/nextjs';

import { cookies } from 'next/headers';

import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from '@/components/theme-provider';
// import { inter, lexendDeca } from "@/app/fonts";
import GlobalDrawer from '@/app/shared/drawer-views/container';
import GlobalModal from '@/app/shared/modal-views/container';

// ** import apis:
import { TRPCReactProvider } from '../trpc/react';

import '@/app/globals.css';
import dynamic from 'next/dynamic';
import { siteConfig } from '@/config/site.config';

const NextProgress = dynamic(() => import('@/components/next-progress'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider cookies={cookies().toString()}>
      <ClerkProvider>
        <html
          lang="en"
          dir="ltr"
          // required this one for next-themes, remove it if you are not using next-theme
          // 💡 Prevent next-themes hydration warning
          suppressHydrationWarning
        >
          <body
            // 💡 Prevent hydration warnings caused by third-party extensions, such as Grammarly.
            suppressHydrationWarning
            // className={cn(inter.variable, lexendDeca.variable, "font-inter")}
          >
            <ThemeProvider>
              <NextProgress />
              {children}
              <Toaster />
              <GlobalDrawer />
              <GlobalModal />
            </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
    </TRPCReactProvider>
  );
}
