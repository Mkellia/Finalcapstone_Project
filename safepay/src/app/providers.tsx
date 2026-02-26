"use client";
import { ChakraProvider, createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50:  { value: '#e3f2fd' },
          100: { value: '#bbdefb' },
          500: { value: '#1565c0' },
          600: { value: '#0d47a1' },
          700: { value: '#0a3d91' },
        },
      },
      fonts: {
        heading: { value: 'Inter, sans-serif' },
        body:    { value: 'Inter, sans-serif' },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChakraProvider value={system}>
        {children}
        <Toaster />
      </ChakraProvider>
    </SessionProvider>
  );
}