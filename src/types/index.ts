/**
 * Mara OS — domain types.
 *
 * These types are the contract between the UI and the data layer.
 * Today they are served by mock repositories (src/repositories/mock).
 * Tomorrow the same interfaces can be implemented by a Supabase
 * repository without touching a single component.
 */

/* ---------------------------------- Fans --------------------------------- */

export type RelationshipLevel =
  | "Lead"
  | "Fan"
  | "Subscriber"
  | "Buyer"
  | "VIP";

export type FanStatus = "Active" | "New" | "Sleeping" | "Churn risk" | "Churned";

export type FanSource =
  | "TikTok"
  | "Instagram"
  | "Telegram"
  | "Threads"
  | "Fanvue"
  | "Reddit"
  | "YouTube";

export interface Fan {
  id: string;
  name: string;
  handle: string;
  avatarTone: string;
  source: FanSource;
  relationship: RelationshipLevel;
  status: FanStatus;
  ltv: number;
  purchases: number;
  subscription: { plan: string; status: "Active" | "Paused" | "None" | "Cancelled"; renews: string } | null;
  lastActivity: string; // ISO
  location: string;
  joined: string; // ISO
  spendTierNote: string;
  tags: string[];
}

export interface Memory {
  id: string;
  fanId: string;
  statement: string;
  category: "interests" | "location" | "content preference" | "boundary" | "lifestyle" | "purchase habit";
  confidence: number;
  source: string;
  createdAt: string;
}

export interface FanEvent {
  id: string;
  fanId: string;
  type: "purchase" | "message" | "subscription" | "tip" | "content" | "system";
  title: string;
  detail: string;
  at: string;
  amount?: number;
}

export interface Purchase {
  id: string;
  fanId: string;
  offer: string;
  kind: "PPV" | "Subscription" | "Tip" | "Bundle";
  amount: number;
  at: string;
  status: "Paid" | "Refunded";
}

/* ----------------------------- Conversations ----------------------------- */

export type MessageAuthor = "fan" | "mara" | "ai_draft";

export interface Message {
  id: string;
  conversationId: string;
  author: MessageAuthor;
  body: string;
  at: string;
  media?: { kind: "image" | "video"; label: string; thumb: string };
  state?: "sent" | "awaiting_approval" | "draft";
}

export interface Conversation {
  id: string;
  fanId: string;
  channel: FanSource;
  subject: string;
  unread: number;
  awaitingApproval: number;
  pinned?: boolean;
  lastMessageAt: string;
  aiSuggestion?: {
    body: string;
    tone: string;
    intent: string;
    confidence: number;
  };
}

/* -------------------------------- Content -------------------------------- */

export type ContentStatus = "Draft" | "Review" | "Approved" | "Scheduled" | "Published";
export type Platform = "TikTok" | "Instagram" | "Threads" | "Fanvue" | "Telegram";
export type ContentType = "Image" | "Video" | "Text" | "Story";

export interface ContentItem {
  id: string;
  title: string;
  hook: string;
  caption: string;
  cta: string;
  platform: Platform;
  type: ContentType;
  status: ContentStatus;
  episodeId?: string;
  assetIds: string[];
  scheduledFor?: string;
  publishedAt?: string;
  views: number;
  engagement: number;
  revenue: number;
  newFollowers: number;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  logline: string;
  description: string;
  status: "Published" | "Scheduled" | "In production" | "Outline";
  publishedAt?: string;
  beat: string;
  contentIds: string[];
  assetIds: string[];
  performance: { views: number; followers: number; retention: number };
}

export type AssetKind = "Photos" | "Videos" | "References" | "Outfits" | "Locations" | "Expressions";

export interface Asset {
  id: string;
  kind: AssetKind;
  title: string;
  thumb: string;
  prompt: string;
  model: "local" | "cloud-pro" | "cloud-turbo";
  outfit: string;
  location: string;
  lighting: string;
  quality: number;
  approval: "Approved" | "Pending" | "Rejected";
  usedIn: number;
  createdAt: string;
}

/* ------------------------------- Monetization ---------------------------- */

export type OfferKind = "Subscription" | "PPV" | "VIP" | "Bundle" | "Tip";

export interface Offer {
  id: string;
  name: string;
  kind: OfferKind;
  price: number;
  cadence: "/ month" | "one-time" | "/ welcome";
  buyers: number;
  revenue: number;
  status: "Live" | "Paused" | "Draft";
  description: string;
  conversion: number;
}

/* -------------------------------- Analytics ------------------------------ */

export interface SeriesPoint {
  label: string;
  value: number;
  compare?: number;
}

export interface MetricSnapshot {
  key: string;
  label: string;
  value: string;
  raw: number;
  delta: number;
  hint: string;
  accent?: boolean;
}

/* ---------------------------------- AI ----------------------------------- */

export type AgentStatus = "Online" | "Idle" | "Paused" | "Error";

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  lastRun: string;
  tasks: number;
  successRate: number;
  description: string;
  capabilities: string[];
}

export interface AIInsight {
  id: string;
  kind: "insight" | "recommendation" | "risk";
  title: string;
  body: string;
  recommendation: string;
  confidence: number;
  cta: { label: string; to: string };
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  steps: { id: string; label: string; detail: string; actor: "system" | "ai" }[];
  runs: number;
  status: "Active" | "Paused";
  lastRun: string;
}

export interface Task {
  id: string;
  title: string;
  detail: string;
  status: "Todo" | "In progress" | "Done";
  priority: "High" | "Normal" | "Low";
  group: string;
  due: string;
  source: string;
}

/* -------------------------------- Character ------------------------------ */

export interface Character {
  id: string;
  name: string;
  age: number;
  city: string;
  occupation: string;
  story: string;
  logline: string;
  voice: string;
  boundaries: string[];
  traits: { label: string; value: string }[];
}

/* ------------------------------- Repositories ---------------------------- */

export interface FanRepository {
  list(query?: { search?: string; segment?: string }): Promise<Fan[]>;
  get(id: string): Promise<Fan | null>;
  memories(fanId: string): Promise<Memory[]>;
  events(fanId: string): Promise<FanEvent[]>;
  purchases(fanId: string): Promise<Purchase[]>;
}

export interface Story {
  title: string;
  logline: string;
  season: string;
  genre: string;
  cadence: string;
}

export interface ContentRepository {
  list(): Promise<ContentItem[]>;
  get(id: string): Promise<ContentItem | null>;
  episodes(): Promise<Episode[]>;
  assets(): Promise<Asset[]>;
  story(): Promise<Story>;
}

export interface ConversationRepository {
  list(): Promise<Conversation[]>;
  messages(conversationId: string): Promise<Message[]>;
}

export interface CommerceRepository {
  offers(): Promise<Offer[]>;
  revenueBySource(): Promise<SeriesPoint[]>;
  revenueByOffer(): Promise<SeriesPoint[]>;
  topSpenders(): Promise<{ fanId: string; name: string; handle: string; amount: number; orders: number; last: string }[]>;
}

export interface AnalyticsRepository {
  metrics(period: string): Promise<MetricSnapshot[]>;
  revenue(period: string): Promise<SeriesPoint[]>;
  audience(period: string): Promise<SeriesPoint[]>;
  engagement(period: string): Promise<SeriesPoint[]>;
  funnel(): Promise<SeriesPoint[]>;
  retention(): Promise<SeriesPoint[]>;
  topContent(): Promise<{ rank: number; title: string; views: number; followers: number; platform: Platform; id: string }[]>;
}

export interface AIRepository {
  agents(): Promise<Agent[]>;
  insights(): Promise<AIInsight[]>;
  automations(): Promise<Automation[]>;
  tasks(): Promise<Task[]>;
}

export interface CharacterRepository {
  get(): Promise<Character>;
}

/* ---------------------------- Presentation mocks ------------------------- */

export type AnalyticsSection = "Content" | "Audience" | "Revenue" | "Conversion" | "Retention";

export interface AnalyticsTile {
  label: string;
  value: string;
  delta: number;
  spark: number[];
  accent?: boolean;
  invertDelta?: boolean;
}

export interface AnalyticsNote {
  tone: "pos" | "warn" | "accent";
  title: string;
  body: string;
}

export interface DashboardRevenueBreakdown {
  label: string;
  value: string;
  tone: "default" | "accent";
}

export interface DashboardAudienceSource {
  label: string;
  value: number;
  delta: string;
}

export interface StackedSeries {
  label: string;
  segments: { key: string; value: number }[];
}

export type ActivityIcon = "fans" | "assets" | "reply" | "risk";

export interface OverviewActivity {
  icon: ActivityIcon;
  label: string;
  value: string;
  meta: string;
}

export interface AnalyticsRetentionStat {
  label: string;
  value: string;
  delta: number;
}

export interface AnalyticsDecision {
  title: string;
  detail: string;
  status: string;
}

export interface RevenueKpi {
  label: string;
  value: string;
  delta: number;
  hint: string;
  accent?: boolean;
}

export interface PayoutEntry {
  label: string;
  value: number;
  status: "Paid" | "Pending";
}

export interface ApprovalQueueItem {
  label: string;
  detail: string;
  tone: "warn" | "neg";
}

export interface AgentQualityMetric {
  label: string;
  value: number;
}

export interface TopbarNotification {
  id: number;
  title: string;
  meta: string;
  tone: "warn" | "info" | "neg" | "pos";
}

export interface OverviewPresentationData {
  revenueBreakdown: DashboardRevenueBreakdown[];
  audienceByPlatform: DashboardAudienceSource[];
  revenueMix: StackedSeries[];
  activity: OverviewActivity[];
  metricSpark: number[];
}

export interface AnalyticsPresentationData {
  kpis: Record<AnalyticsSection, AnalyticsTile[]>;
  notes: AnalyticsNote[];
  followersByPlatform: SeriesPoint[];
  revenueMix: StackedSeries[];
  topContentSpark: number[];
  retentionStats: AnalyticsRetentionStat[];
  decisionLog: AnalyticsDecision[];
}

export interface RevenuePresentationData {
  kpis: RevenueKpi[];
  perFan: SeriesPoint[];
  payoutLedger: PayoutEntry[];
}

export interface ActionQueueItem {
  id: string;
  label: string;
  meta: string;
  tone: "warn" | "pos" | "accent" | "neg";
  to: string;
}

export interface PresentationRepository {
  overview(): Promise<OverviewPresentationData>;
  actionQueue(): Promise<ActionQueueItem[]>;
  analytics(): Promise<AnalyticsPresentationData>;
  revenue(): Promise<RevenuePresentationData>;
  notifications(): Promise<TopbarNotification[]>;
  approvals(): Promise<ApprovalQueueItem[]>;
  agentQuality(): Promise<AgentQualityMetric[]>;
}
