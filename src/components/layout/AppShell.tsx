"use client";

import { Suspense, useEffect, useState } from "react";
import { ToastProvider } from "@/components/ui/Feedback";
import { cn } from "@/utils/cn";
import { CommandMenu } from "./CommandMenu";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

function RouteFallback() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 lg:px-8 lg:py-8" aria-busy="true">
      <div className="h-7 w-48 animate-pulse rounded bg-surface-2" />
      <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-surface-2" />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const [command, setCommand] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommand((current) => !current);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ToastProvider>
      <div className="flex h-full bg-canvas">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div
          className={cn("fixed inset-0 z-90 lg:hidden", drawer ? "" : "pointer-events-none")}
          aria-hidden={!drawer}
        >
          <button
            type="button"
            aria-label="Close navigation"
            tabIndex={drawer ? 0 : -1}
            className={cn(
              "absolute inset-0 bg-black/65 transition-opacity duration-200",
              drawer ? "opacity-100" : "opacity-0",
            )}
            onClick={() => setDrawer(false)}
          />
          <div
            className={cn(
              "absolute inset-y-0 left-0 transition-transform duration-250 ease-out",
              drawer ? "translate-x-0" : "-translate-x-full",
            )}
            inert={!drawer}
          >
            <Sidebar onNavigate={() => setDrawer(false)} />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            sidebarOpen={drawer}
            onOpenSidebar={() => setDrawer(true)}
            onOpenCommand={() => setCommand(true)}
          />
          <main className="min-w-0 flex-1 overflow-y-auto">
            <Suspense fallback={<RouteFallback />}>{children}</Suspense>
          </main>
        </div>

        <CommandMenu key={command ? "open" : "closed"} open={command} onClose={() => setCommand(false)} />
      </div>
    </ToastProvider>
  );
}
