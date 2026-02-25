import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tirwin Talent",
  description: "Tirwin Talent Web Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/assets/css/fonts.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/plugins.css" />
        <link rel="stylesheet" href="/assets/css/theme.css" />
      </head>
      <body className={inter.className}>
        {children}
        <Script src="/assets/js/jquery.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" strategy="lazyOnload" />
        <Script src="https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/plugins.js" strategy="lazyOnload" />
        <Script src="/assets/js/functions.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
