import QueryProvider from "@/components/provider/QueryClientProvider";
import { ThemeProvider } from "@/components/provider/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Author's Alchemy",
  description: "Discover, Share, and Read Blogs Like Never Before! Join our innovative blogging platform where you can effortlessly share your thoughts, connect with fellow writers, and curate your favorite blogs into personalized e-books. Whether you’re a passionate blogger or an avid reader, our user-friendly interface makes it easy to explore diverse topics, engage with a vibrant community, and create collections that enhance your reading experience. Start your blogging journey today and transform your favorite reads into beautifully organized books!",
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
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <QueryProvider>
              {children}
              <SpeedInsights />
            </QueryProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
