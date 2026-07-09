import { PageHeader, ComingSoon } from "@/components/page-header";
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <div>
      <PageHeader title="Catalogus" description="Batterijen, werkzaamheden en opties — de bron voor alle prijzen." />
      <ComingSoon milestone="M2" />
    </div>
  );
}
