import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  title: {
    default: "Blogify - Write, Share and Grow",
    template: "%s | Blogify",
  },
  description: "A modern, sophisticated platform to share your thoughts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} bg-background antialiased overflow-auto font-sans text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
