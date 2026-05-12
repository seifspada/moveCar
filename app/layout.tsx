// app/layout.tsx
import type { Metadata } from "next";
import { UserProvider } from "./context/userContext";
import { ApolloProviderWrapper } from "@/providers/ApolloProviderWrapper";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "MoveCar",
  description: "Service de convoyage de véhicules",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased bg-zinc-950 text-white" suppressHydrationWarning>
        <ApolloProviderWrapper>
          <UserProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              expand={false}
              closeButton
              theme="dark"
            />
          </UserProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}