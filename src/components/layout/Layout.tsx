
import React from "react";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className={cn("flex-1 container py-8 px-4 md:px-8 animate-fade-in", className)}>
        {children}
      </main>
      <Toaster />
    </div>
  );
}
