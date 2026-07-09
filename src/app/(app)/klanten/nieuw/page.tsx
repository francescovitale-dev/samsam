import Link from "next/link";
import { requireUser } from "@/lib/auth-guard";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { CustomerForm } from "../customer-form";
import { saveCustomer } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewCustomerPage() {
  await requireUser();
  const action = saveCustomer.bind(null, null);
  return (
    <div>
      <Button render={<Link href="/klanten" />} variant="ghost" size="sm" className="mb-2 gap-1">
        <ChevronLeft className="size-4" /> Terug naar klanten
      </Button>
      <PageHeader title="Nieuwe klant" />
      <CustomerForm
        action={action}
        customer={{ company: "", contact: "", email: "", phone: "", adres1: "", adres2: "" }}
      />
    </div>
  );
}
