import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { appName, appDescription } from "@/config";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: appName,
  description: appDescription,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en" className={dmSans.variable}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers cookies={cookies}>{children}</Providers>
      </body>
    </html>
  );
}
