import type {
  AIRepository,
  AnalyticsRepository,
  CharacterRepository,
  CommerceRepository,
  ContentRepository,
  ConversationRepository,
  FanRepository,
  PresentationRepository,
} from "@/types";
import * as fansData from "@/data/fans";
import * as contentData from "@/data/content";
import * as ops from "@/data/ops";

/**
 * Mock implementations of the Mara OS repositories.
 *
 * Every method is async so the UI is written against a boundary that
 * already behaves like a network call. Replacing this module with a
 * Supabase implementation requires no component changes.
 */

const LATENCY = 220;
const wait = <T,>(value: T, ms = LATENCY): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

class MockFanRepository implements FanRepository {
  list(query?: { search?: string; segment?: string }) {
    let rows = [...fansData.fans];
    if (query?.search) {
      const q = query.search.toLowerCase();
      rows = rows.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.handle.toLowerCase().includes(q) ||
          f.source.toLowerCase().includes(q),
      );
    }
    if (query?.segment && query.segment !== "All") {
      const s = query.segment;
      rows = rows.filter((f) => {
        if (s === "New") return f.status === "New";
        if (s === "Active") return f.status === "Active";
        if (s === "Subscribers") return f.relationship === "Subscriber" || f.relationship === "VIP";
        if (s === "Buyers") return f.purchases > 0;
        if (s === "VIP") return f.relationship === "VIP";
        if (s === "At Risk") return f.status === "Churn risk" || f.status === "Sleeping";
        return true;
      });
    }
    return wait(rows);
  }

  get(id: string) {
    return wait(fansData.fans.find((f) => f.id === id) ?? null, 120);
  }

  memories(fanId: string) {
    return wait(fansData.memories.filter((m) => m.fanId === fanId));
  }

  events(fanId: string) {
    return wait(fansData.events.filter((e) => e.fanId === fanId));
  }

  purchases(fanId: string) {
    return wait(fansData.purchases.filter((p) => p.fanId === fanId));
  }
}

class MockContentRepository implements ContentRepository {
  list() {
    return wait(contentData.contentItems);
  }
  get(id: string) {
    return wait(contentData.contentItems.find((c) => c.id === id) ?? null, 120);
  }
  episodes() {
    return wait(contentData.episodes);
  }
  assets() {
    return wait(contentData.assets);
  }
  story() {
    return wait(contentData.story);
  }
}

class MockConversationRepository implements ConversationRepository {
  list() {
    return wait(fansData.conversations);
  }
  messages(conversationId: string) {
    return wait(fansData.messages.filter((m) => m.conversationId === conversationId));
  }
}

class MockCommerceRepository implements CommerceRepository {
  offers() {
    return wait(contentData.offers);
  }
  revenueBySource() {
    return wait(ops.revenueBySource);
  }
  revenueByOffer() {
    return wait(ops.revenueByOffer);
  }
  topSpenders() {
    return wait(ops.topSpenders);
  }
}

class MockAnalyticsRepository implements AnalyticsRepository {
  metrics(period: string) {
    return wait(ops.metrics(period));
  }
  revenue(period: string) {
    return wait(ops.revenue(period));
  }
  audience(period: string) {
    return wait(ops.audience(period));
  }
  engagement(period: string) {
    return wait(ops.engagement(period));
  }
  funnel() {
    return wait(ops.funnel);
  }
  retention() {
    return wait(ops.retention);
  }
  topContent() {
    return wait(ops.topContent);
  }
}

class MockAIRepository implements AIRepository {
  agents() {
    return wait(ops.agents);
  }
  insights() {
    return wait(ops.insights);
  }
  automations() {
    return wait(ops.automations);
  }
  tasks() {
    return wait(ops.tasks);
  }
}

class MockCharacterRepository implements CharacterRepository {
  get() {
    return wait(ops.character, 100);
  }
}

class MockPresentationRepository implements PresentationRepository {
  overview() {
    return wait(ops.overviewPresentation);
  }
  actionQueue() {
    return wait(ops.actionQueue);
  }
  analytics() {
    return wait(ops.analyticsPresentation);
  }
  revenue() {
    return wait(ops.revenuePresentation);
  }
  notifications() {
    return wait(ops.topbarNotifications);
  }
  approvals() {
    return wait(ops.approvalQueue);
  }
  agentQuality() {
    return wait(ops.agentQuality);
  }
}

export const mockRepositories = {
  fans: new MockFanRepository(),
  content: new MockContentRepository(),
  conversations: new MockConversationRepository(),
  commerce: new MockCommerceRepository(),
  analytics: new MockAnalyticsRepository(),
  ai: new MockAIRepository(),
  character: new MockCharacterRepository(),
  presentation: new MockPresentationRepository(),
};
