import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { StateSync } from "@/components/StateSync";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORG_SCHEMA, WEBSITE_SCHEMA } from "@/lib/seo-schemas";

const SITE_URL = process.env.PUBLIC_APP_URL ?? "https://fisifun.corebytecnologia.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FisiFun — Física, Química, Cálculo e Geometria Analítica para vestibular",
    template: "%s · FisiFun",
  },
  description:
    "Estude Física, Química, Cálculo 1 e Geometria Analítica de forma gamificada. Trilhas, XP, IA tutora, exercícios resolvidos e revisão espaçada. Ideal pra vestibular, Enem, engenharia e cursinho.",
  keywords: [
    "fisifun",
    "física online",
    "estudar física",
    "química online",
    "cálculo 1",
    "geometria analítica",
    "vestibular",
    "enem",
    "halliday",
    "engenharia",
    "cursinho online",
    "exercícios resolvidos",
    "tutor IA",
    "duolingo de física",
  ],
  authors: [{ name: "CoreByte Tecnologia", url: "https://corebytecnologia.com" }],
  creator: "CoreByte Tecnologia",
  publisher: "CoreByte Tecnologia",
  applicationName: "FisiFun",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "FisiFun",
    title: "FisiFun — Estude Física, Química, Cálculo e GA jogando",
    description:
      "App de estudos gamificado pra Física, Química, Cálculo 1 e Geometria Analítica. Trilhas, XP, IA tutora e revisão espaçada. Comece grátis 3 dias.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "FisiFun — app de estudos gamificado",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FisiFun — Estude Física e Exatas jogando",
    description:
      "Trilhas, XP, IA tutora e exercícios resolvidos pra Física, Química, Cálculo 1 e GA.",
    images: ["/icon-512.png"],
  },
  appleWebApp: {
    capable: true,
    title: "FisiFun",
    statusBarStyle: "black-translucent",
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <JsonLd data={ORG_SCHEMA} />
        <JsonLd data={WEBSITE_SCHEMA} />
      </head>
      <body className="min-h-screen">
        <AppShell>{children}</AppShell>
        <ServiceWorkerRegister />
        <StateSync />
      </body>
    </html>
  );
}
