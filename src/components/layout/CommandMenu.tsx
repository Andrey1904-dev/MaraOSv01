"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Clapperboard,
  CornerDownLeft,
  Images,
  MessageSquare,
  Search,
  Sparkles,
  Tag,
  Users,
  Wallet,
} from "lucide-react";
import { flatNav } from "./nav";
import { useResource } from "@/hooks/useResource";
import { repositories } from "@/repositories";
import { cn } from "@/utils/cn";

interface Command {
  id: string;
  label: string;
  hint: string;
  group: "Navigate" | "Create" | "Fans" | "Content";
  icon: React.ReactNode;
  run: () => void;
}

export function CommandMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const navigate = useCallback((to: string) => router.push(to), [router]);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const { data: fans } = useResource(() => repositories.fans.list());
  const { data: contentItems } = useResource(() => repositories.content.list());

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = flatNav
      .filter((item) => item.to !== "/")
      .map((item) => ({
        id: `nav-${item.to}`,
        label: item.label,
        hint: item.to,
        group: "Navigate",
        icon: <item.icon className="size-4" strokeWidth={1.75} />,
        run: () => navigate(item.to),
      }));

    const create: Command[] = [
      {
        id: "create-content",
        label: "Create content",
        hint: "content / new",
        group: "Create",
        icon: <Images className="size-4" strokeWidth={1.75} />,
        run: () => navigate("/content/new"),
      },
      {
        id: "create-offer",
        label: "Create offer",
        hint: "offers",
        group: "Create",
        icon: <Tag className="size-4" strokeWidth={1.75} />,
        run: () => navigate("/offers?new=1"),
      },
      {
        id: "open-ai",
        label: "Open AI Studio",
        hint: "ai",
        group: "Create",
        icon: <Sparkles className="size-4" strokeWidth={1.75} />,
        run: () => navigate("/ai"),
      },
      {
        id: "open-conversations",
        label: "Open conversations",
        hint: "inbox",
        group: "Create",
        icon: <MessageSquare className="size-4" strokeWidth={1.75} />,
        run: () => navigate("/conversations"),
      },
      {
        id: "open-revenue",
        label: "Open revenue",
        hint: "revenue",
        group: "Create",
        icon: <Wallet className="size-4" strokeWidth={1.75} />,
        run: () => navigate("/revenue"),
      },
      {
        id: "open-episodes",
        label: "Open storyline",
        hint: "episodes",
        group: "Create",
        icon: <Clapperboard className="size-4" strokeWidth={1.75} />,
        run: () => navigate("/episodes"),
      },
      {
        id: "open-analytics",
        label: "Open analytics",
        hint: "analytics",
        group: "Create",
        icon: <BarChart3 className="size-4" strokeWidth={1.75} />,
        run: () => navigate("/analytics"),
      },
    ];

    const fanCommands: Command[] = (fans ?? []).slice(0, 8).map((fan) => ({
      id: `fan-${fan.id}`,
      label: fan.name,
      hint: `${fan.handle} · ${fan.relationship}`,
      group: "Fans",
      icon: <Users className="size-4" strokeWidth={1.75} />,
      run: () => navigate(`/fans/${fan.id}`),
    }));

    const contentCommands: Command[] = (contentItems ?? []).slice(0, 6).map((content) => ({
      id: `content-${content.id}`,
      label: content.title,
      hint: `${content.platform} · ${content.status}`,
      group: "Content",
      icon: <Images className="size-4" strokeWidth={1.75} />,
      run: () => navigate(`/content?open=${content.id}`),
    }));

    return [...nav, ...create, ...fanCommands, ...contentCommands];
  }, [navigate, fans, contentItems]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return commands;
    return commands.filter(
      (command) =>
        command.label.toLowerCase().includes(normalizedQuery) ||
        command.hint.toLowerCase().includes(normalizedQuery) ||
        command.group.toLowerCase().includes(normalizedQuery),
    );
  }, [commands, query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setIndex((current) => Math.min(filtered.length - 1, current + 1));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setIndex((current) => Math.max(0, current - 1));
      }
      if (event.key === "Enter") {
        const command = filtered[index];
        if (command) {
          command.run();
          onClose();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, filtered, index, onClose]);

  if (!open) return null;

  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-200 flex items-start justify-center p-4 pt-[12vh]">
      <button
        type="button"
        className="anim-overlay absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close command menu"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mara OS command menu"
        className="anim-sheet relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-pop)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-4 text-faint" aria-hidden="true" />
          <input
            autoFocus
            aria-label="Search pages, fans, and content"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIndex(0);
            }}
            placeholder="Search fans, content or jump to a page…"
            className="h-12 flex-1 bg-transparent text-[13.5px] text-ink placeholder:text-faint focus:outline-none"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-faint">ESC</kbd>
        </div>

        <div className="hide-scrollbar max-h-[52vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <div className="px-3 py-10 text-center text-[12.5px] text-muted">No results for “{query}”</div>
          )}
          {filtered.map((command, commandIndex) => {
            const showGroup = command.group !== lastGroup;
            lastGroup = command.group;
            return (
              <div key={command.id}>
                {showGroup && <div className="label px-2.5 pt-3 pb-1.5">{command.group}</div>}
                <button
                  type="button"
                  onMouseEnter={() => setIndex(commandIndex)}
                  onClick={() => {
                    command.run();
                    onClose();
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                    commandIndex === index ? "bg-surface-3 text-ink" : "text-ink-2",
                  )}
                >
                  <span className={cn(commandIndex === index ? "text-accent-hi" : "text-faint")}>{command.icon}</span>
                  <span className="flex-1 truncate text-[13px]">{command.label}</span>
                  <span className="num truncate text-[11px] text-faint">{command.hint}</span>
                  {commandIndex === index && <CornerDownLeft className="size-3.5 text-faint" aria-hidden="true" />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-line bg-canvas-2/60 px-4 py-2.5 text-[10.5px] text-faint">
          <span className="flex items-center gap-3">
            <span>↑↓ navigate</span>
            <span>↵ open</span>
          </span>
          <span className="flex items-center gap-1">
            Mara OS command palette <ArrowRight className="size-3" aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}
