import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Allo Health - Front Desk",
  description: "Manage patient queues and appointments efficiently.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return ( <html lang="en" className="dark"><body className={inter.className}>{children}</body></html> );
}
