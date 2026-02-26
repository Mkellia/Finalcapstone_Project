"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BuyerOrdersPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/buyer?tab=orders'); }, [router]);
  return null;
}