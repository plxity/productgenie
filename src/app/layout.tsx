import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import "./styles/globals.css";

let title = "Product Genie";
let description = "Generate stunning product images in seconds.";
let ogimage = "https://productgenie.in/og-image.png";
let sitename = "productgenie.in";

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: "/camera.svg",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: "productgenie.in",
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#17181C] text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}