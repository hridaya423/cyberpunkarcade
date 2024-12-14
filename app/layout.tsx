import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cyberpunk Arcade",
  description: "Play games with a futuristic twist!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
