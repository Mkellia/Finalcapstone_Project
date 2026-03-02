"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SellerOrdersPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/seller?tab=orders");
  }, [router]);
  return null;
}
