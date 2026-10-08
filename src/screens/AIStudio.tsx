import { useState } from "react";
import {
  Activity,
  Brain,
  CheckCircle2,
  Circle,
  Gauge,
  MessageSquare,
  Play,
  Settings2,
  Sparkles,
} from "lucide-react";
import { PageContainer, PageHeader, Grid } from "@/components/layout/Page";
import { Card, CardHeader, Badge, StatusBadge, Avatar, Divider, ProgressBar, KeyStat } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Overlays";
import { SkeletonCards, useToast } from "@/components/ui/Feedback";
import { AICard, AINote } from "@/components/common/AICard";
import { useResource } from "@/hooks/useResource";
import { repositories } from "@/repositories";
import { media } from "@/data/media";
import { ago } from "@/lib/format";
import type { Agent } from "@/types";
import { cn } from "@/utils/cn";

export default function AIStudio() {
  const { push } = useToast();
  const { data: agents, loading } = useResource(() => repositories.ai.agents());
  const { data: insights } = useResource(() => repositories.ai.insights());
  const { data: tasks } = useResource(() => repositories.ai.tasks());
  const [active, setActive] = useState<Agent | null>(null);

  const online = (agents ?? []).filter((a) => a.status === "Online").length;
  const totalTasks = (agents ?? []).reduce((s, a) => s + a.tasks, 0);
  const avgSuccess = (agents ?? []).reduce((s, a) => s + a.successRate, 0) / Math.max(1, (agents ?? []).length);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="AI"
        title="AI Studio"
        description="The brain of Mara OS — six agents that draft, remember, decide and explain. Every output waits for approval."
        meta={
          <>
            <span className="flex items-center gap-1.5 text-[12px] text-muted">
              <Circle className="size-1.5 fill-pos text-pos" />
              {online} of {(agents ?? []).length} agents online
            </span>
            <span className="num text-[12px] text-muted">{totalTasks.toLocaleString("en-US")} tasks completed</span>
            <span className="num text-[12px] text-muted">{avgSuccess.toFixed(1)}% avg success</span>
          </>
        }
        actions={
          <Button
            variant="primary"
            onClick={() => push({ title: "All agents triggered", description: "A full sync run was queued.", tone: "success" })}
          >
            <Play className="size-3.5" /> Run all agents
          </Button>
        }
      />

      {loading ? (
        <SkeletonCards count={6} />
      ) : (
        <Grid className="lg:grid-cols-3">
          {(agents ?? []).map((agent) => (
            <Card key={agent.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-canvas-2 text-accent-hi">
                    <Brain className="size-4" strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-[14px] font-medium text-ink">{agent.name}</h3>
                    <div className="mt-0.5 text-[11.5px] text-muted">{agent.role}</div>
                  </div>
                </div>
                <StatusBadge status={agent.status} />
              </div>

              <p className="mt-3.5 flex-1 text-[12.5px] leading-relaxed text-muted">{agent.description}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {agent.capabilities.map((c) => (
                  <Badge key={c}>{c}</Badge>
                ))}
              </div>

              <Divider className="my-4" />

              <div className="grid grid-cols-3 gap-3">
                <KeyStat label="Last run" value={ago(agent.lastRun)} />
                <KeyStat label="Tasks" value={agent.tasks.toLocaleString("en-US")} />
                <KeyStat label="Success" value={`${agent.successRate}%`} />
              </div>

              <ProgressBar
                value={agent.successRate}
                tone={agent.successRate > 94 ? "pos" : agent.successRate > 90 ? "accent" : "warn"}
                className="mt-4"
              />

              <Button variant="subtle" size="sm" className="mt-4" onClick={() => setActive(agent)}>
                <Settings2 className="size-3.5" /> Open agent
              </Button>
            </Card>
          ))}
        </Grid>
      )}

      <Grid className="mt-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Agent activity" subtitle="Runs per hour, last 12 hours" action={<Badge><Activity className="size-3" /> live</Badge>} />
          <div className="px-5 pb-5">
            <div className="flex items-end gap-1" style={{ height: 140 }}>
              {Array.from({ length: 12 }).map((_, i) => {
                const h = 30 + ((i * 37) % 68);
                return (
                  <div key={i} className="group flex flex-1 flex-col justify-end" style={{ height: "100%" }}>
                    <div
                      className={cn("anim-rise w-full rounded-t-[3px] bg-accent transition-opacity group-hover:opacity-80", i % 4 === 0 ? "opacity-100" : "opacity-55")}
                      style={{ height: `${h}%`, animationDelay: `${i * 40}ms` }}
                    />
                    <span className="mt-1.5 text-center text-[9.5px] text-faint">{i * 2}h</span>
                  </div>
                );
              })}
            </div>
            <Divider className="my-4" />
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              <KeyStat label="Runs / hour" value="148" hint="avg" />
              <KeyStat label="Queue depth" value="9" hint="awaiting approval" />
              <KeyStat label="Tokens today" value="1.2M" hint="mock estimate" />
              <KeyStat label="Escalations" value="3" hint="to operator" />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Mara · character state" subtitle="Character Agent snapshot" />
          <div className="px-5 pb-5">
            <div className="flex items-center gap-3">
              <Avatar name="Mara Quinn" src={media.mara} size={42} />
              <div>
                <div className="text-[13.5px] font-medium text-ink">Mara Quinn</div>
                <div className="text-[11.5px] text-muted">Voice: dry, first-person</div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { label: "Voice consistency", value: 97 },
                { label: "Boundary compliance", value: 100 },
                { label: "Continuity accuracy", value: 94 },
              ].map((r) => (
                <div key={r.label}>
                  <div className="mb-1.5 flex justify-between text-[12px]">
                    <span className="text-muted">{r.label}</span>
                    <span className="num text-ink-2">{r.value}%</span>
                  </div>
                  <ProgressBar value={r.value} tone={r.value === 100 ? "pos" : "accent"} height={3} />
                </div>
              ))}
            </div>
            <AINote title="Character Agent">
              41 memories were refreshed overnight. No contradictions with published episodes.
            </AINote>
          </div>
        </Card>
      </Grid>

      <Grid className="mt-4 lg:grid-cols-3">
        {(insights ?? []).slice(1, 4).map((ins) => (
          <AICard
            key={ins.id}
            compact
            eyebrow={ins.kind === "risk" ? "AI RISK" : "AI RECOMMENDATION"}
            title={ins.title}
            body={ins.body}
            recommendation={ins.recommendation}
            confidence={ins.confidence}
            cta={ins.cta}
          />
        ))}
      </Grid>

      <Card className="mt-4">
        <CardHeader title="Recent agent output" subtitle="Drafts, memories and insights produced in the last 24 hours" />
        <div>
          {(tasks ?? []).slice(0, 5).map((t) => (
            <div key={t.id} className="flex flex-wrap items-center gap-3 border-b border-line/60 px-5 py-3 last:border-0">
              <span className="grid size-7 shrink-0 place-items-center rounded-md border border-line bg-canvas-2 text-faint">
                {t.source === "Conversations" ? <MessageSquare className="size-3.5" /> : t.source === "Assets" ? <Sparkles className="size-3.5" /> : <Gauge className="size-3.5" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-ink">{t.title}</div>
                <div className="truncate text-[11.5px] text-faint">{t.detail}</div>
              </div>
              <Badge>{t.source}</Badge>
              <StatusBadge status={t.status} />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => push({ title: "Task updated", description: t.title, tone: "success" })}
              >
                <CheckCircle2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Drawer open={!!active} onClose={() => setActive(null)} title={active?.name} width="max-w-lg">
        {active && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg border border-line bg-canvas-2 text-accent-hi">
                <Brain className="size-4.5" strokeWidth={1.8} />
              </span>
              <div>
                <div className="text-[14px] font-medium text-ink">{active.name}</div>
                <div className="text-[11.5px] text-muted">{active.role}</div>
              </div>
              <StatusBadge status={active.status} className="ml-auto" />
            </div>

            <p className="text-[12.5px] leading-relaxed text-muted">{active.description}</p>

            <div className="grid grid-cols-3 gap-4 rounded-lg border border-line bg-canvas-2/50 p-4">
              <KeyStat label="Status" value={active.status} />
              <KeyStat label="Last run" value={ago(active.lastRun)} />
              <KeyStat label="Tasks" value={active.tasks.toLocaleString("en-US")} />
            </div>

            <div>
              <div className="label mb-2.5">Capabilities</div>
              <div className="flex flex-wrap gap-1.5">
                {active.capabilities.map((c) => (
                  <Badge key={c} tone="accent">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="label mb-2.5">Configuration</div>
              <div className="space-y-2.5">
                {[
                  { label: "Model", value: "mock-provider" },
                  { label: "Temperature", value: "0.7" },
                  { label: "Requires approval", value: active.id === "ag_conversation" ? "Always" : "On publish" },
                  { label: "Auto-run schedule", value: "Every 5 minutes" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between text-[12.5px]">
                    <span className="text-muted">{r.label}</span>
                    <span className="text-ink">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  push({ title: `${active.name} triggered`, description: "Run queued — results appear in the activity feed.", tone: "success" });
                  setActive(null);
                }}
              >
                <Play className="size-3.5" /> Run now
              </Button>
              <Button variant="subtle" onClick={() => setActive(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
}
