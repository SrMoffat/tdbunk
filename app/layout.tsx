import { TBDexContextProvider } from '@/app/providers/TBDexProvider';
import ThemeProvider from '@/app/providers/ThemeProvider';
import { Web5ContextProvider } from '@/app/providers/Web5Provider';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TDBunk",
  description: "Dismiss DISinformation and MISinformation through a cross-border crowdfunded investigation to debuunk (TDBunk) by crowdsourced investigators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web5ContextProvider>
          <TBDexContextProvider>
            <AntdRegistry>
              <ThemeProvider>
                {children}
              </ThemeProvider>
            </AntdRegistry>
          </TBDexContextProvider>
        </Web5ContextProvider>
      </body>
    </html>
  );
};
