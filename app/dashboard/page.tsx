import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <div className="absolute inset-0 top-16">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-10">
            <p className="p-4 max-w-2xl mx-auto text-gray-500">
              <strong>Welcome to Million Ears</strong>, an app for preserving
              and exploring treasured family memories. You can call in to your
              dedicated phone number (xxx-xxx-xxxx) to record memories, or{" "}
              <Link href="/create" className="text-blue-500">
                schedule a phone call
              </Link>{" "}
              to be made to a family member to ask them to record a memory.{" "}
            </p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
