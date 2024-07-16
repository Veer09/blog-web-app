import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import  Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/provider/QueryClientProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className=" overflow-hidden">
        <body className={cn(inter.className, "h-screen")}>
          <QueryProvider>
              {children}
          </QueryProvider>
          <Toaster/>
        </body>
      </html>
    </ClerkProvider>
  );
}
