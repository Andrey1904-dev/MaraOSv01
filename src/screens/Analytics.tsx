import { useState } from "react";
import { ArrowUpRight, Target, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { PageContainer, PageHeader, Grid } from "@/components/layout/Page";
import { Card, CardHeader, Badge, Divider, Delta, ProgressBar, StatusBadge } from "@/components/ui/Card";
import { AreaChart, BarChart, FunnelBars, Sparkline, StackedBars } from "@/components/ui/charts";
import { DateRangePicker } from "@/components/ui/Controls";
import { MetricCard } from "@/components/ui/MetricCard";
import { useResource } from "@/hooks/useResource";
import { repositories } from "@/repositories";
import { number as fmtNum } from "@/lib/format";
import { cn } from "@/utils/cn";

const SECTIONS = ["Content", "Audience", "Revenue", "Conversion", "Retention"] as const;

export default function Analytics() {
  const [section, setSection] = useState<(typeof SECTIONS)[number]>("Content");
  const [period, setPeriod] = useState("30 days");

  const { data: revenue } = useResource(() => repositories.analytics.revenue(period), [period]);
  const { data: audience } = useResource(() => repositories.analytics.audience(period), [period]);
  const { data: engagement } = useResource(() => repositories.analytics.engagement(period), [period]);
  const { data: funnel } = useResource(() => repositories.analytics.funnel());
  const { data: retention } = useResource(() => repositories.analytics.retention());
  const { data: top } = useResource(() => repositories.analytics.topContent());
  const { data: presentation } = useResource(() => repositories.presentation.analytics());

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Business"
        title="Analytics"
        description="A decision surface: what is working, what is decaying, and where the next dollar comes from."
        actions={<DateRangePicker value={period} onChange={setPeriod} />}
      />

      <div className="hide-scrollbar -mx-1 mb-5 flex gap-1 overflow-x-auto px-1">
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={cn(
              "shrink-0 rounded-lg border px-3.5 py-2 text-[12.5px] font-medium transition-colors",
              section === s
                ? "border-accent/40 bg-accent/12 text-ink"
                : "border-line text-muted hover:border-line-2 hover:text-ink-2",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Section KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {(presentation?.kpis[section] ?? []).map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>

      <Grid className="mt-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title={
              section === "Revenue"
                ? "Revenue"
                : section === "Audience"
                  ? "Audience growth"
                  : section === "Conversion"
                    ? "Conversion trend"
                    : section === "Retention"
                      ? "Retention curve"
                      : "Engagement rate"
            }
            subtitle={`${period} · with previous period comparison`}
            action={<Badge tone="pos"><TrendingUp className="size-3" /> trending up</Badge>}
          />
          <div className="px-5 pb-5">
            <AreaChart
              data={
                section === "Revenue"
                  ? (revenue ?? [])
                  : section === "Audience"
                    ? (audience ?? [])
                    : section === "Retention"
                      ? (retention ?? [])
                      : section === "Conversion"
                        ? (audience ?? []).map((p) => ({ label: p.label, value: Math.round(p.value * 0.28), compare: Math.round((p.compare ?? 0) * 0.26) }))
                        : (engagement ?? [])
              }
              height={244}
              format={section === "Revenue" ? "currency" : section === "Audience" ? "number" : "number"}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="What this means" subtitle="Analytics Agent read-out" />
          <div className="space-y-4 px-5 pb-5">
            {(presentation?.notes ?? []).map((note) => (
              <div key={note.title} className="rounded-lg border border-line bg-canvas-2/50 p-3.5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      note.tone === "pos" ? "bg-pos" : note.tone === "warn" ? "bg-warn" : "bg-accent",
                    )}
                  />
                  <span className="text-[12.5px] font-medium text-ink">{note.title}</span>
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{note.body}</p>
              </div>
            ))}
            <Link href="/ai" className="flex items-center gap-1.5 text-[12px] text-accent-hi hover:underline">
              Open AI Studio <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </Card>
      </Grid>

      <Grid className="mt-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Conversion funnel" subtitle="Reach → VIP" />
          <div className="px-5 pb-5">
            <FunnelBars data={funnel ?? []} />
            <Divider className="my-4" />
            <div className="flex items-center gap-2 text-[11.5px] text-muted">
              <Target className="size-3.5" />
              Biggest leak: profile visit → fan creation (6.4%).
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Followers by platform" subtitle="All time" />
          <div className="px-5 pb-5">
            <BarChart
              data={presentation?.followersByPlatform ?? []}
              horizontal
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Revenue by source" subtitle="Attribution" />
          <div className="px-5 pb-5">
            <StackedBars
              data={presentation?.revenueMix ?? []}
              height={150}
            />
          </div>
        </Card>
      </Grid>

      <Grid className="mt-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Top content" subtitle="Ranked by follower conversion" />
          <div>
            {(top ?? []).map((t) => (
              <Link
                key={t.id}
                href={`/content?open=${t.id}`}
                className="flex items-center gap-4 border-b border-line/60 px-5 py-3.5 transition-colors last:border-0 hover:bg-surface-2"
              >
                <span className="num text-[12px] text-faint">{t.rank}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] text-ink">“{t.title}”</div>
                  <div className="num mt-0.5 text-[11px] text-faint">{fmtNum(t.views, true)} views</div>
                </div>
                <Sparkline values={presentation?.topContentSpark ?? []} />
                <Badge tone="pos">+{fmtNum(t.followers)}</Badge>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Retention & churn" subtitle="Cohort curve with churn overlay" />
          <div className="px-5 pb-5">
            <AreaChart data={retention ?? []} height={150} showCompare={false} format="percent" />
            <Divider className="my-4" />
            <div className="grid grid-cols-3 gap-4">
              {(presentation?.retentionStats ?? []).map((metric) => (
                <div key={metric.label}>
                  <div className="label">{metric.label}</div>
                  <div className="num mt-1.5 text-[15px] font-medium text-ink">{metric.value}</div>
                  <Delta value={metric.delta} invert={metric.label === "Churn"} />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-[11.5px] text-muted">
              <TrendingDown className="size-3.5" />
              Churn improves to 3.9% when episode drops stay weekly.
            </div>
          </div>
        </Card>
      </Grid>

      <Card className="mt-4">
        <CardHeader title="Decision log" subtitle="What the operator changed based on analytics" />
        <div className="grid gap-px bg-line lg:grid-cols-3">
          {(presentation?.decisionLog ?? []).map((d) => (
            <div key={d.title} className="bg-surface px-5 py-4">
              <StatusBadge status={d.status} />
              <div className="mt-2.5 text-[13px] font-medium text-ink">{d.title}</div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">{d.detail}</p>
              <ProgressBar value={d.status === "Approved" ? 100 : d.status === "In progress" ? 55 : 25} className="mt-3" height={3} />
            </div>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
}
