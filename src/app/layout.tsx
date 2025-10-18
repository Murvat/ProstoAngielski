import type { Metadata } from "next";
import "./tailwind.css"
import CookieConsentProvider from "./domains/privacy/components/CookieConsentProvider";


export const metadata: Metadata = {
  title: "Prosto Angielski",
  description: "Best way to learn english ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body   
      >
        <CookieConsentProvider>{children}</CookieConsentProvider>
      </body>
    </html>
  );
}
