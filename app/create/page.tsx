"use client";

import { useId } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
  const nameId = useId();
  const phoneId = useId();
  const promptId = useId();
  return (
    <div className="absolute inset-0 top-16">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-10">
            <div className="max-w-2xl mx-auto w-full">
              <h1 className="text-2xl font-semibold mb-2">
                Make a Memory Collection Call
              </h1>
              <p className="text-gray-500 mb-8">
                Make a phone call to a family member to record a memory. After
                you submit, the person will get a phone call immediately.
              </p>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor={nameId}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Name
                  </label>
                  <Input
                    id={nameId}
                    type="text"
                    placeholder="Enter the person's name"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={phoneId}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Phone Number
                  </label>
                  <Input id={phoneId} type="tel" placeholder="(555) 555-5555" />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={promptId}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Memory Prompt
                  </label>
                  <textarea
                    id={promptId}
                    rows={6}
                    placeholder="What memory would you like them to discuss? (e.g., 'Tell me about your first day of school' or 'Share your favorite holiday memory')"
                    className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive resize-none"
                  />
                </div>

                <Button type="button" size="lg" className="w-full">
                  Make Call
                </Button>
              </form>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
