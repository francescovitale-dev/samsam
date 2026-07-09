import { PageHeader, ComingSoon } from "@/components/page-header";
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <div>
      <PageHeader title="Klanten" description="Beheer klanten voor hergebruik bij nieuwe offertes." />
      <ComingSoon milestone="M2" />
    </div>
  );
}
