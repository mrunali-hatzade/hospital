import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nakade Hospital & Sonography Clinic | Lakhandur",
  description: "Nakade Hospital & Sonography Clinic offers premier Gynecology, Obstetrics, Ultrasound scans, Pediatrics, and family healthcare services in Lakhandur, Maharashtra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
