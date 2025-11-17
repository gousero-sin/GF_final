import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoFinance - Neo Finance Dashboard",
  description:
    "Aplicação GoFinance para controle financeiro com linguagem natural e visual neo-futurista.",
  keywords: ["GoFinance", "finanças pessoais", "Next.js", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "GoFinance" }],
  icons: {
    icon: "/logo.png",       // pega de public/logo.png
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "GoFinance - Neo Finance Dashboard",
    description:
      "Controle suas finanças com interface minimalista e input em linguagem natural.",
    url: "https://gofinance-final-f3ac3ez64-gousero-sins-projects.vercel.app",
    siteName: "GoFinance",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoFinance - Neo Finance Dashboard",
    description:
      "Controle financeiro com visual neo-chinese e processamento de linguagem natural.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
