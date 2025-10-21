"use client";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardButton() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Button
      className={`cursor-pointer ${pathname === "/dashboard" ? "bg-white" : ""}`}
      variant="outline"
      onClick={() => router.push("/dashboard")}
    >
      Dashboard
    </Button>
  );
}
