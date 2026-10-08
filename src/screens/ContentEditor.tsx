import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "@/hooks/useQueryParams";
import { ArrowLeft } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/Page";
import { Card } from "@/components/ui/Card";
import { ContentEditorPanel } from "@/components/content/ContentEditorPanel";
import { useResource } from "@/hooks/useResource";
import { repositories } from "@/repositories";

export default function ContentEditor() {
  const router = useRouter();
  const routeParams = useParams<{ id: string }>();
  const id = routeParams.id;
  const [searchParams] = useSearchParams();
  const openId = id ?? searchParams.get("open");

  const { data } = useResource(
    () => (openId ? repositories.content.get(openId) : Promise.resolve(null)),
    [openId],
  );

  return (
    <PageContainer>
      <button
        onClick={() => router.push("/content")}
        className="mb-4 flex items-center gap-1.5 text-[12.5px] text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" /> Back to Content
      </button>

      <PageHeader
        eyebrow="Content"
        title={data ? `Edit · ${data.title}` : "Create content"}
        description={
          data
            ? `${data.platform} · ${data.type} · created for the 365-days storyline`
            : "Write the hook, caption and CTA, attach an approved asset and place it inside an episode."
        }
      />

      <Card className="p-5">
        <ContentEditorPanel item={data} onCancel={() => router.push("/content")} onSaved={() => router.push("/content")} />
      </Card>
    </PageContainer>
  );
}
