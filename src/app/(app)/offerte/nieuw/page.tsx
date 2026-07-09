import { PageHeader, ComingSoon } from "@/components/page-header";
export default function Page() {
  return (
    <div>
      <PageHeader title="Nieuwe offerte" description="Kies klant, template en batterijen." />
      <ComingSoon milestone="M3" />
    </div>
  );
}
