// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "./context/userContext";
import NavBarClient from "./components/navBarClient";
import { ApolloProviderWrapper } from "@/providers/ApolloProviderWrapper";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Revolution",
  description: "Service de convoyage de véhicules",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className="antialiased"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        suppressHydrationWarning
      >
        <ApolloProviderWrapper>
          <UserProvider>
            <NavBarClient />
            {children}
            <Toaster
              position="top-right"
              richColors
              expand={false}
              closeButton
            />
          </UserProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
