import { MOCK_NOW_MS } from "./mockTime";
import type {
  ActionQueueItem,
  Agent,
  AgentQualityMetric,
  AIInsight,
  AnalyticsPresentationData,
  ApprovalQueueItem,
  Automation,
  Character,
  MetricSnapshot,
  OverviewPresentationData,
  RevenuePresentationData,
  TopbarNotification,
  SeriesPoint,
  Task,
} from "@/types";

const days = (n: number) => new Date(MOCK_NOW_MS - n * 86_400_000).toISOString();
const mins = (n: number) => new Date(MOCK_NOW_MS - n * 60_000).toISOString();

/* -------------------------------- Character ------------------------------ */

export const character: Character = {
  id: "char_mara",
  name: "Mara Quinn",
  age: 23,
  city: "Chicago",
  occupation: "Marketing Coordinator",
  story: "365 days to buy back my time",
  logline:
    "A 23-year-old marketing coordinator in Chicago counts every hour she owes in a red notebook — and gives herself one year to buy all of it back.",
  voice:
    "Dry, first-person, honest about numbers. Never sweet, never desperate. Short sentences when it hurts.",
  boundaries: [
    "No explicit content",
    "Never break the first-person diary frame",
    "Never invent real debt numbers that contradict published episodes",
    "No political or medical topics",
  ],
  traits: [
    { label: "Tone", value: "Dry, self-aware" },
    { label: "Style", value: "Editorial diary" },
    { label: "Signature object", value: "Red notebook" },
    { label: "Language", value: "English" },
    { label: "Posting cadence", value: "Daily · episode Fridays" },
  ],
};

/* --------------------------------- Metrics ------------------------------- */

const metricSet = (scale: number): MetricSnapshot[] => [
  { key: "revenue", label: "Revenue", value: "$4,820", raw: 4820 * scale, delta: 12.4, hint: "vs previous period", accent: true },
  { key: "subs", label: "Subscribers", value: "184", raw: 184 * scale, delta: 8.2, hint: "active subscriptions" },
  { key: "fans", label: "New Fans", value: "327", raw: Math.round(327 * scale), delta: 21.6, hint: "first contact created" },
  { key: "ppv", label: "PPV Sales", value: "$1,940", raw: 1940 * scale, delta: 16.1, hint: "one-time unlocks" },
  { key: "ltv", label: "Average LTV", value: "$74", raw: 74 * scale, delta: 4.3, hint: "per fan, lifetime" },
  { key: "churn", label: "Churn", value: "4.8%", raw: 4.8, delta: -0.6, hint: "monthly subscription churn" },
];

export const metrics = (period: string): MetricSnapshot[] => {
  const scale =
    period === "7 days" ? 0.28 : period === "30 days" ? 1 : period === "90 days" ? 2.7 : 6.4;
  return metricSet(scale).map((m) =>
    m.key === "churn"
      ? { ...m, value: period === "7 days" ? "3.9%" : period === "90 days" ? "5.6%" : period === "All time" ? "6.1%" : "4.8%" }
      : {
          ...m,
          value:
            m.key === "subs"
              ? String(Math.round(m.raw))
              : m.key === "fans"
                ? String(Math.round(m.raw))
                : `$${Math.round(m.raw).toLocaleString("en-US")}`,
        },
  );
};

/* --------------------------------- Series -------------------------------- */

const revenue7: SeriesPoint[] = [
  { label: "Mon", value: 382, compare: 310 },
  { label: "Tue", value: 455, compare: 372 },
  { label: "Wed", value: 512, compare: 401 },
  { label: "Thu", value: 468, compare: 428 },
  { label: "Fri", value: 894, compare: 604 },
  { label: "Sat", value: 1120, compare: 712 },
  { label: "Sun", value: 989, compare: 648 },
];

const revenue30: SeriesPoint[] = Array.from({ length: 30 }, (_, i) => {
  const base = 90 + Math.sin(i / 2.4) * 42 + i * 3.6;
  const weekend = i % 7 === 5 || i % 7 === 6 ? 62 : 0;
  return {
    label: `${i + 1}`,
    value: Math.round(base + weekend),
    compare: Math.round(base * 0.78 + weekend * 0.6),
  };
});

export const revenue = (period: string): SeriesPoint[] =>
  period === "7 days"
    ? revenue7
    : period === "90 days"
      ? Array.from({ length: 13 }, (_, i) => ({
          label: `W${i + 1}`,
          value: Math.round(760 + i * 118 + Math.sin(i / 1.7) * 180),
          compare: Math.round(600 + i * 92 + Math.sin(i / 1.7) * 140),
        }))
      : period === "All time"
        ? Array.from({ length: 12 }, (_, i) => ({
            label: ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"][i],
            value: Math.round(1180 + i * 340 + Math.sin(i / 1.4) * 320),
            compare: Math.round(880 + i * 250 + Math.sin(i / 1.4) * 240),
          }))
        : revenue30;

export const audience = (period: string): SeriesPoint[] => {
  const len = period === "7 days" ? 7 : period === "90 days" ? 13 : period === "All time" ? 12 : 30;
  return Array.from({ length: len }, (_, i) => {
    const t = i / Math.max(1, len - 1);
    return {
      label: period === "All time" ? ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"][i] : `${i + 1}`,
      value: Math.round(1840 + t * 641 + Math.sin(t * 6) * 60),
      compare: Math.round(1204 + t * 380 + Math.sin(t * 6) * 40),
    };
  });
};

export const engagement = (period: string): SeriesPoint[] => {
  const len = period === "7 days" ? 7 : period === "90 days" ? 13 : period === "All time" ? 12 : 30;
  return Array.from({ length: len }, (_, i) => ({
    label: `${i + 1}`,
    value: Number((5.2 + Math.sin(i / 2.1) * 1.8 + (i % 5) * 0.32).toFixed(1)),
    compare: Number((4.4 + Math.cos(i / 2.6) * 1.1).toFixed(1)),
  }));
};

export const funnel: SeriesPoint[] = [
  { label: "Reach", value: 412000 },
  { label: "Profile visits", value: 38600 },
  { label: "Fans created", value: 2481 },
  { label: "First purchase", value: 684 },
  { label: "Subscribers", value: 184 },
  { label: "VIP", value: 27 },
];

export const retention: SeriesPoint[] = [
  { label: "M1", value: 100 },
  { label: "M2", value: 86 },
  { label: "M3", value: 74 },
  { label: "M4", value: 63 },
  { label: "M5", value: 58 },
  { label: "M6", value: 52 },
];

export const revenueBySource: SeriesPoint[] = [
  { label: "Fanvue", value: 2810 },
  { label: "TikTok", value: 640 },
  { label: "Instagram", value: 512 },
  { label: "Telegram", value: 486 },
  { label: "Threads", value: 372 },
];

export const revenueByOffer: SeriesPoint[] = [
  { label: "Subscription", value: 2610 },
  { label: "Welcome bundle", value: 1632 },
  { label: "VIP", value: 1323 },
  { label: "Gym mirror set", value: 778 },
  { label: "Late night", value: 479 },
];

export const topSpenders = [
  { fanId: "fan_ryan", name: "Ryan Whitfield", handle: "@ryanwhit", amount: 1240, orders: 21, last: mins(18) },
  { fanId: "fan_alex", name: "Alex Johnson", handle: "@alexjohnson", amount: 840, orders: 14, last: mins(4) },
  { fanId: "fan_jordan", name: "Jordan Vance", handle: "@jordanvance", amount: 812, orders: 11, last: mins(63) },
  { fanId: "fan_ben", name: "Ben Adler", handle: "@benadler", amount: 306, orders: 9, last: days(6) },
  { fanId: "fan_daniel", name: "Daniel Osei", handle: "@danielosei", amount: 236, orders: 8, last: mins(122) },
];

export const topContent = [
  { rank: 1, title: "The notebook", views: 82400, followers: 2988, platform: "TikTok" as const, id: "cnt_01" },
  { rank: 2, title: "Monday again", views: 61300, followers: 1871, platform: "Instagram" as const, id: "cnt_02" },
  { rank: 3, title: "Debt update", views: 49200, followers: 1104, platform: "Threads" as const, id: "cnt_03" },
];

/* ----------------------------------- AI ---------------------------------- */

export const agents: Agent[] = [
  {
    id: "ag_character",
    name: "Character Agent",
    role: "Keeps Mara consistent",
    status: "Online",
    lastRun: mins(3),
    tasks: 148,
    successRate: 99.1,
    description:
      "Owns Mara's voice, boundaries and storyline continuity. Reviews every outbound message and caption against the character card.",
    capabilities: ["Voice checks", "Continuity", "Boundary guardrails"],
  },
  {
    id: "ag_conversation",
    name: "Conversation Agent",
    role: "Drafts every reply",
    status: "Online",
    lastRun: mins(1),
    tasks: 1240,
    successRate: 94.7,
    description:
      "Writes replies in Mara's voice, detects intent, escalates anything that needs a human decision. Never sends without approval.",
    capabilities: ["Draft replies", "Intent detection", "Escalation"],
  },
  {
    id: "ag_memory",
    name: "Memory Agent",
    role: "Remembers the fans",
    status: "Online",
    lastRun: mins(7),
    tasks: 862,
    successRate: 96.3,
    description:
      "Extracts facts, preferences and boundaries from conversations and turns them into structured memories with confidence scores.",
    capabilities: ["Fact extraction", "Preference modelling", "Decay"],
  },
  {
    id: "ag_content",
    name: "Content Agent",
    role: "Builds the storyline",
    status: "Online",
    lastRun: mins(22),
    tasks: 316,
    successRate: 91.8,
    description:
      "Turns story beats into hooks, captions and shot lists. Matches episodes to assets and proposes the publishing calendar.",
    capabilities: ["Hooks", "Captions", "Shot lists", "Calendar"],
  },
  {
    id: "ag_sales",
    name: "Sales Agent",
    role: "Monetizes without pressure",
    status: "Online",
    lastRun: mins(12),
    tasks: 508,
    successRate: 88.4,
    description:
      "Recommends the right offer for the right fan at the right moment, based on LTV, purchase rhythm and content preference.",
    capabilities: ["Offer matching", "Timing", "Win-back"],
  },
  {
    id: "ag_analytics",
    name: "Analytics Agent",
    role: "Explains the numbers",
    status: "Idle",
    lastRun: mins(48),
    tasks: 194,
    successRate: 97.2,
    description:
      "Watches performance across platforms, finds what works and writes the insight the operator should act on today.",
    capabilities: ["Anomaly detection", "Attribution", "Insights"],
  },
];

export const insights: AIInsight[] = [
  {
    id: "ins_01",
    kind: "insight",
    title: "Storyline outperformance",
    body: `Mara's "365 days" storyline is outperforming standalone lifestyle posts by 34%.`,
    recommendation: "Continue the storyline this week — episode 05 should ship Friday, not next week.",
    confidence: 93,
    cta: { label: "Create episode", to: "/episodes" },
  },
  {
    id: "ins_02",
    kind: "recommendation",
    title: "Churn risk cluster",
    body: "4 subscribers paused within 48 hours of the price change. All four watched episode 03 but not 04.",
    recommendation: "Send the episode 04 preview with a one-month loyalty price before Friday.",
    confidence: 81,
    cta: { label: "Draft messages", to: "/conversations" },
  },
  {
    id: "ins_03",
    kind: "recommendation",
    title: "Fitness PPV demand",
    body: "Fans with a fitness memory bought 3.2× more often when the PPV referenced training.",
    recommendation: "Lead the next drop with the 6am gym set instead of the apartment set.",
    confidence: 87,
    cta: { label: "Open content", to: "/content" },
  },
  {
    id: "ins_04",
    kind: "risk",
    title: "Reply latency",
    body: "Median first-reply time rose to 41 minutes. VIP fans reply 6× more when answered under 10 minutes.",
    recommendation: "Approve the 12 queued drafts in the next hour.",
    confidence: 90,
    cta: { label: "Open inbox", to: "/conversations" },
  },
];

export const automations: Automation[] = [
  {
    id: "auto_01",
    name: "New fan onboarding",
    trigger: "New fan created",
    status: "Active",
    runs: 2481,
    lastRun: mins(12),
    steps: [
      { id: "s1", label: "Create CRM profile", detail: "Fan record, source attribution, first-touch content", actor: "system" },
      { id: "s2", label: "Assign relationship level", detail: "Lead → Fan, based on source and engagement", actor: "system" },
      { id: "s3", label: "Start memory tracking", detail: "Memory Agent subscribes to the fan's conversations", actor: "ai" },
      { id: "s4", label: "Queue welcome message", detail: "Draft created, waits for approval", actor: "ai" },
    ],
  },
  {
    id: "auto_02",
    name: "PPV purchase → next action",
    trigger: "Fan purchases PPV",
    status: "Active",
    runs: 684,
    lastRun: mins(4),
    steps: [
      { id: "s1", label: "Update LTV", detail: "Amount added to lifetime value and revenue attribution", actor: "system" },
      { id: "s2", label: "Update relationship", detail: "Fan → Buyer at $1, Buyer → VIP at $500", actor: "system" },
      { id: "s3", label: "Add event", detail: "Purchase event written to the fan timeline", actor: "system" },
      { id: "s4", label: "AI recommends next action", detail: "Sales Agent proposes the follow-up offer", actor: "ai" },
    ],
  },
  {
    id: "auto_03",
    name: "Churn risk rescue",
    trigger: "No activity for 7 days",
    status: "Active",
    runs: 96,
    lastRun: mins(38),
    steps: [
      { id: "s1", label: "Detect inactivity", detail: "Sleeping score computed nightly", actor: "system" },
      { id: "s2", label: "Pull memories", detail: "Top 3 preferences used for personalization", actor: "ai" },
      { id: "s3", label: "Draft win-back message", detail: "Tone: honest, no discount unless LTV > $200", actor: "ai" },
      { id: "s4", label: "Notify operator", detail: "Task created in Today", actor: "system" },
    ],
  },
  {
    id: "auto_04",
    name: "Episode publishing",
    trigger: "Episode marked Ready",
    status: "Paused",
    runs: 5,
    lastRun: days(2),
    steps: [
      { id: "s1", label: "Attach assets", detail: "Approved assets matched to the episode beat", actor: "system" },
      { id: "s2", label: "Generate caption + hook", detail: "Content Agent writes 3 variants", actor: "ai" },
      { id: "s3", label: "Build platform cuts", detail: "9:16, 4:5 and text-only variants", actor: "system" },
      { id: "s4", label: "Schedule Friday 18:00", detail: "Awaiting operator approval", actor: "system" },
    ],
  },
];

export const tasks: Task[] = [
  { id: "t1", title: "Approve 8 AI replies", detail: "Conversation Agent has 8 drafts waiting over 30 minutes.", status: "Todo", priority: "High", group: "Today", due: "09:30", source: "Conversations" },
  { id: "t2", title: "Review 3 images", detail: "Assets ast_05, ast_11, ast_12 are pending approval.", status: "Todo", priority: "Normal", group: "Today", due: "11:00", source: "Assets" },
  { id: "t3", title: "Publish Episode 05", detail: "Reality check — scheduled Friday 18:00, needs final caption.", status: "Todo", priority: "High", group: "Today", due: "18:00", source: "Episodes" },
  { id: "t4", title: "Check 2 churn-risk fans", detail: "Ben Adler and Andre Silva both crossed the 7-day threshold.", status: "Todo", priority: "High", group: "Today", due: "12:00", source: "Fans" },
  { id: "t5", title: "Write episode 06 outline", detail: "Chicago beat — needs a second character decision.", status: "In progress", priority: "Normal", group: "Today", due: "20:00", source: "AI Studio" },
  { id: "t6", title: "Approve gym mirror set caption", detail: "3 hook variants generated by Content Agent.", status: "In progress", priority: "Normal", group: "Today", due: "15:00", source: "Content" },
  { id: "t7", title: "Set up welcome bundle A/B test", detail: "$24 vs $19 for TikTok-sourced fans.", status: "Todo", priority: "Low", group: "This week", due: "Thu", source: "Offers" },
  { id: "t8", title: "Refresh VIP memory summaries", detail: "27 VIP fans need an updated preference snapshot.", status: "Todo", priority: "Low", group: "This week", due: "Fri", source: "AI Studio" },
  { id: "t9", title: "Reconcile Fanvue payout", detail: "February payout $2,810 vs ledger.", status: "Done", priority: "Normal", group: "Today", due: "08:00", source: "Revenue" },
  { id: "t10", title: "Publish episode 04 trailer", detail: "TikTok + Instagram cuts.", status: "Done", priority: "Normal", group: "Today", due: "07:40", source: "Content" },
];

export const actionQueue: ActionQueueItem[] = [
  { id: "q1", label: "12 conversations awaiting approval", meta: " oldest 41 min", tone: "warn" as const, to: "/conversations" },
  { id: "q2", label: "3 content pieces ready to publish", meta: " episode 05 + 2 stories", tone: "pos" as const, to: "/content" },
  { id: "q3", label: "2 high-value fans active", meta: " Ryan · Alex", tone: "accent" as const, to: "/fans" },
  { id: "q4", label: "1 subscriber at churn risk", meta: " Ben Adler", tone: "neg" as const, to: "/fans" },
];

/* ----------------------------- Screen summaries -------------------------- */

export const dashboardRevenueBreakdown: OverviewPresentationData["revenueBreakdown"] = [
  { label: "Subscriptions", value: "$2,610", tone: "default" },
  { label: "PPV", value: "$1,940", tone: "default" },
  { label: "Tips", value: "$270", tone: "default" },
  { label: "Net after fees", value: "$3,910", tone: "accent" },
];

export const dashboardAudienceByPlatform: OverviewPresentationData["audienceByPlatform"] = [
  { label: "TikTok", value: 148200, delta: "+18.2%" },
  { label: "Instagram", value: 62400, delta: "+9.4%" },
  { label: "Telegram", value: 21800, delta: "+24.1%" },
];

export const dashboardRevenueMix: OverviewPresentationData["revenueMix"] = ["W15", "W16", "W17", "W18", "W19", "W20"].map((label, index) => ({
  label,
  segments: [
    { key: "Subscriptions", value: 520 + index * 62 },
    { key: "PPV", value: 300 + index * 84 },
    { key: "Tips", value: 40 + index * 9 },
  ],
}));

export const overviewActivity: OverviewPresentationData["activity"] = [
  { icon: "fans", label: "New fans", value: "+38", meta: "24h · TikTok dominant" },
  { icon: "assets", label: "Assets generated", value: "12", meta: "9 approved · 3 pending" },
  { icon: "reply", label: "Median reply time", value: "41 min", meta: "AI draft ready in 8s" },
  { icon: "risk", label: "Churn signals", value: "4", meta: "1 high LTV" },
];

export const dashboardMetricSpark = [8, 12, 9, 15, 14, 19, 22, 26];

const analyticsKpis: AnalyticsPresentationData["kpis"] = {
  Content: [
    { label: "Views", value: "271K", delta: 18.4, spark: [12, 18, 15, 24, 22, 31, 38] },
    { label: "Engagement", value: "6.4%", delta: 2.1, spark: [4, 5, 4.6, 5.4, 6, 6.2, 6.4] },
    { label: "Follower growth", value: "+5,963", delta: 21.6, spark: [8, 10, 12, 16, 19, 24, 29] },
    { label: "Watch-through", value: "64%", delta: 3.8, spark: [52, 54, 58, 60, 61, 63, 64] },
    { label: "Posts published", value: "38", delta: 5.9, spark: [3, 4, 3, 5, 4, 5, 5] },
  ],
  Audience: [
    { label: "Followers", value: "232K", delta: 14.2, spark: [10, 14, 16, 20, 24, 27, 32] },
    { label: "Fans in CRM", value: "2,481", delta: 12.8, spark: [20, 24, 28, 30, 34, 38, 42] },
    { label: "Active fans", value: "1,204", delta: 6.1, spark: [18, 20, 22, 24, 25, 27, 30] },
    { label: "New / week", value: "327", delta: 21.6, spark: [5, 8, 7, 12, 15, 18, 22] },
    { label: "Top source", value: "TikTok", delta: 24.1, spark: [9, 12, 16, 18, 22, 26, 31] },
  ],
  Revenue: [
    { label: "Revenue", value: "$4,820", delta: 12.4, accent: true, spark: [10, 14, 12, 18, 22, 26, 31] },
    { label: "Net revenue", value: "$3,910", delta: 11.1, spark: [9, 12, 11, 15, 18, 21, 25] },
    { label: "PPV share", value: "40%", delta: 3.2, spark: [30, 32, 34, 36, 38, 39, 40] },
    { label: "Revenue / fan", value: "$26.20", delta: 3.6, spark: [20, 21, 22, 24, 25, 26, 26] },
    { label: "Top offer", value: "Bundle", delta: 18.2, spark: [8, 10, 13, 14, 16, 17, 18] },
  ],
  Conversion: [
    { label: "Reach → fan", value: "0.60%", delta: 0.4, spark: [3, 4, 5, 5, 6, 6, 6] },
    { label: "Fan → buyer", value: "27.6%", delta: 2.8, spark: [18, 20, 22, 24, 25, 27, 28] },
    { label: "Buyer → sub", value: "26.9%", delta: -1.2, spark: [32, 30, 29, 28, 28, 27, 27] },
    { label: "Sub → VIP", value: "14.7%", delta: 1.9, spark: [9, 10, 11, 12, 13, 14, 15] },
    { label: "Bundle take-rate", value: "18.2%", delta: 4.1, spark: [10, 12, 13, 15, 16, 17, 18] },
  ],
  Retention: [
    { label: "M1 retention", value: "86%", delta: 1.4, spark: [80, 82, 83, 84, 85, 86, 86] },
    { label: "M3 retention", value: "74%", delta: -0.8, spark: [78, 77, 76, 75, 75, 74, 74] },
    { label: "Churn", value: "4.8%", delta: -0.6, invertDelta: true, spark: [6, 5.8, 5.5, 5.2, 5, 4.9, 4.8] },
    { label: "Resurrected", value: "38", delta: 9.4, spark: [4, 6, 8, 10, 12, 14, 15] },
    { label: "Avg. lifetime", value: "4.2 mo", delta: 2.2, spark: [3, 3.2, 3.5, 3.8, 4, 4.1, 4.2] },
  ],
};

const analyticsNotes: AnalyticsPresentationData["notes"] = [
  {
    tone: "pos",
    title: "Storyline carries the growth",
    body: "Episode-tagged content produced 68% of new followers with 41% of the posting volume.",
  },
  {
    tone: "warn",
    title: "Buyer → subscriber is slipping",
    body: "Conversion from first purchase to subscription fell 1.2pt after the price change.",
  },
  {
    tone: "accent",
    title: "Highest leverage action",
    body: "Ship episode 05 on Friday and attach the gym PPV — modeled +$610 over 10 days.",
  },
];

const followersByPlatform: AnalyticsPresentationData["followersByPlatform"] = [
  { label: "TikTok", value: 148200 },
  { label: "Instagram", value: 62400 },
  { label: "Telegram", value: 21800 },
  { label: "Threads", value: 9400 },
  { label: "Fanvue", value: 3600 },
];

const analyticsRevenueMix: AnalyticsPresentationData["revenueMix"] = ["W18", "W19", "W20", "W21"].map((label, index) => ({
  label,
  segments: [
    { key: "Subscriptions", value: 520 + index * 48 },
    { key: "PPV", value: 300 + index * 62 },
    { key: "Tips", value: 40 + index * 7 },
  ],
}));

const revenueKpis: RevenuePresentationData["kpis"] = [
  { label: "Revenue", value: "$4,820", delta: 12.4, hint: "gross, all platforms", accent: true },
  { label: "Net Revenue", value: "$3,910", delta: 11.1, hint: "after platform fees" },
  { label: "PPV", value: "$1,940", delta: 16.1, hint: "one-time unlocks" },
  { label: "Subscriptions", value: "$2,610", delta: 8.2, hint: "184 active" },
  { label: "Tips", value: "$270", delta: -4.2, hint: "17 tips" },
  { label: "ARPU", value: "$26.20", delta: 3.6, hint: "per paying fan" },
];

const revenuePerFan: RevenuePresentationData["perFan"] = [
  { label: "$0", value: 1797 },
  { label: "$1–50", value: 402 },
  { label: "$51–150", value: 186 },
  { label: "$151–400", value: 71 },
  { label: "$401+", value: 25 },
];

const payoutLedger: RevenuePresentationData["payoutLedger"] = [
  { label: "Fanvue · February", value: 2810, status: "Paid" },
  { label: "TikTok Creator · February", value: 640, status: "Paid" },
  { label: "Instagram bonuses", value: 512, status: "Pending" },
  { label: "Telegram Stars", value: 486, status: "Paid" },
];

export const approvalQueue: ApprovalQueueItem[] = [
  { label: "8 conversation drafts", detail: "Conversation Agent · median wait 41 min", tone: "warn" },
  { label: "3 asset approvals", detail: "Content Agent · blocks episode 05 cuts", tone: "warn" },
  { label: "1 churn intervention", detail: "Sales Agent · waiting on win-back approval", tone: "neg" },
];

export const agentQuality: AgentQualityMetric[] = [
  { label: "Voice consistency", value: 97 },
  { label: "Boundary compliance", value: 100 },
  { label: "Continuity accuracy", value: 94 },
];

export const topbarNotifications: TopbarNotification[] = [
  { id: 1, title: "12 conversations awaiting approval", meta: "Conversation Agent · 41 min oldest", tone: "warn" },
  { id: 2, title: "Episode 05 ready to publish", meta: "Scheduled Friday 18:00", tone: "info" },
  { id: 3, title: "Ben Adler cancelled subscription", meta: "Churn risk · LTV $306", tone: "neg" },
  { id: 4, title: "Asset approved: Mara · late night", meta: "Quality 97 · used in 3 items", tone: "pos" },
];

const analyticsTopContentSpark = [8, 14, 11, 22, 28, 34, 41];

const analyticsRetentionStats: AnalyticsPresentationData["retentionStats"] = [
  { label: "Churn", value: "4.8%", delta: -0.6 },
  { label: "Pause rate", value: "3.1%", delta: 0.4 },
  { label: "Resurrect", value: "38", delta: 9.4 },
];

const analyticsDecisionLog: AnalyticsPresentationData["decisionLog"] = [
  { title: "Moved the gym PPV to Friday", detail: "Fitness-memory fans convert 3.2× more often.", status: "Approved" },
  { title: "Paused lifestyle-only posts", detail: "34% below storyline performance.", status: "In progress" },
  { title: "Loyalty price for 4 pausers", detail: "Retention play before the next episode.", status: "Review" },
];

export const overviewPresentation: OverviewPresentationData = {
  revenueBreakdown: dashboardRevenueBreakdown,
  audienceByPlatform: dashboardAudienceByPlatform,
  revenueMix: dashboardRevenueMix,
  activity: overviewActivity,
  metricSpark: dashboardMetricSpark,
};

export const analyticsPresentation: AnalyticsPresentationData = {
  kpis: analyticsKpis,
  notes: analyticsNotes,
  followersByPlatform,
  revenueMix: analyticsRevenueMix,
  topContentSpark: analyticsTopContentSpark,
  retentionStats: analyticsRetentionStats,
  decisionLog: analyticsDecisionLog,
};

export const revenuePresentation: RevenuePresentationData = {
  kpis: revenueKpis,
  perFan: revenuePerFan,
  payoutLedger,
};
