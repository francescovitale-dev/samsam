import { PageHeader, ComingSoon } from "@/components/page-header";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <PageHeader title="Offerte bewerken" description={`ID: ${id}`} />
      <ComingSoon milestone="M3" />
    </div>
  );
}
