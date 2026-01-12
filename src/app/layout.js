import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SSL Generator",
  description: "Made with love by pradipta",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Acme" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen">
          <div className="grid min-h-screen grid-rows-[auto_1fr_auto] mx-10">
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
