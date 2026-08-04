"use client";

import MobileBottomNav from "@/components/MobileBottomNav";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <MobileBottomNav />
      </CartProvider>
    </AuthProvider>
  );
}
