"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Circle,
  Menu,
  PanelLeft,
  Search,
  Settings as SettingsIcon,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Dropdown, MenuItem, MenuLabel, MenuSeparator } from "@/components/ui/Overlays";
import { useResource } from "@/hooks/useResource";
import { repositories } from "@/repositories";
import { media } from "@/data/media";
import { cn } from "@/utils/cn";

export function Topbar({
  onOpenSidebar,
  onOpenCommand,
  sidebarOpen,
}: {
  onOpenSidebar: () => void;
  onOpenCommand: () => void;
  sidebarOpen: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [read, setRead] = useState(false);
  const { data: notifications } = useResource(() => repositories.presentation.notifications());
  const crumbs = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-canvas/85 px-4 backdrop-blur-md lg:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
        aria-expanded={sidebarOpen}
        className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-ink lg:hidden"
      >
        <Menu className="size-4" aria-hidden="true" />
      </button>

      <div className="hidden min-w-0 items-center gap-2 lg:flex">
        <PanelLeft className="size-3.5 text-faint" aria-hidden="true" />
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[12.5px]">
          <Link href="/" className="text-muted transition-colors hover:text-ink-2">
            Mara OS
          </Link>
          {crumbs.map((crumb, index) => (
            <span key={`${crumb}-${index}`} className="flex items-center gap-1.5">
              <span className="text-faint" aria-hidden="true">/</span>
              <span className={cn("truncate capitalize", index === crumbs.length - 1 ? "text-ink" : "text-muted")}>
                {crumb.startsWith("fan_") ? "Profile" : crumb === "new" ? "Create" : crumb.replace(/-/g, " ")}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <button
        type="button"
        onClick={onOpenCommand}
        aria-label="Search or jump to a page"
        className="ml-auto flex h-8 w-full max-w-[320px] items-center gap-2 rounded-lg border border-line bg-canvas-2 px-3 text-[12.5px] text-faint transition-colors hover:border-line-2 hover:text-muted lg:ml-6"
      >
        <Search className="size-3.5" aria-hidden="true" />
        <span className="flex-1 text-left">Search or jump to…</span>
        <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[10px] sm:block">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
        <div className="hidden items-center gap-1.5 rounded-lg border border-line bg-canvas-2 px-2.5 py-1.5 xl:flex">
          <Circle className="size-1.5 fill-pos text-pos" aria-hidden="true" />
          <span className="text-[11.5px] text-muted">6 agents online</span>
        </div>

        <Dropdown
          align="end"
          trigger={({ open, toggle, menuId }) => (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls={menuId}
              aria-label="Notifications"
              className="relative grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <Bell className="size-4" strokeWidth={1.75} aria-hidden="true" />
              {!read && <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-accent" />}
            </button>
          )}
        >
          {(close) => (
            <div className="w-80">
              <div className="flex items-center justify-between px-2.5 py-2">
                <span className="text-[12.5px] font-medium text-ink">Notifications</span>
                <button
                  type="button"
                  onClick={() => {
                    setRead(true);
                    close();
                  }}
                  className="text-[11px] text-muted transition-colors hover:text-ink"
                >
                  Mark all read
                </button>
              </div>
              <MenuSeparator />
              {(notifications ?? []).map((notification) => (
                <div key={notification.id} className="flex gap-2.5 rounded-md px-2.5 py-2 hover:bg-surface-3">
                  <Circle
                    className={cn(
                      "mt-1.5 size-1.5 shrink-0",
                      notification.tone === "warn" && "fill-warn text-warn",
                      notification.tone === "neg" && "fill-neg text-neg",
                      notification.tone === "pos" && "fill-pos text-pos",
                      notification.tone === "info" && "fill-info text-info",
                    )}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <div className="text-[12.5px] leading-snug text-ink">{notification.title}</div>
                    <div className="mt-0.5 text-[11px] text-faint">{notification.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Dropdown>

        <Dropdown
          align="end"
          trigger={({ open, toggle, menuId }) => (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls={menuId}
              aria-label="Open character menu"
              className="flex items-center gap-2 rounded-lg py-1 pr-2 pl-1 transition-colors hover:bg-surface-2"
            >
              <Image src={media.mara} alt="Mara Quinn" width={24} height={24} unoptimized className="size-6 rounded-full object-cover" />
              <ChevronDown className="size-3.5 text-faint" aria-hidden="true" />
            </button>
          )}
        >
          {(close) => (
            <>
              <MenuLabel>Character</MenuLabel>
              <MenuItem icon={<UserRound className="size-3.5" />} onClick={() => { close(); router.push("/settings"); }}>
                Mara Quinn · profile
              </MenuItem>
              <MenuItem icon={<Sparkles className="size-3.5" />} onClick={() => { close(); router.push("/ai"); }}>
                AI Studio
              </MenuItem>
              <MenuSeparator />
              <MenuItem icon={<SettingsIcon className="size-3.5" />} onClick={() => { close(); router.push("/settings"); }}>
                Settings
              </MenuItem>
            </>
          )}
        </Dropdown>
      </div>
    </header>
  );
}
