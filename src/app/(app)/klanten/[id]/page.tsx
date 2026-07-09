import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trash2 } from "lucide-react";
import { CustomerForm } from "../customer-form";
import { saveCustomer, deleteCustomer } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const c = await prisma.customer.findUnique({ where: { id } });
  if (!c) notFound();

  const address = (c.address as { adres1?: string; adres2?: string } | null) ?? {};
  const action = saveCustomer.bind(null, c.id);
  const doDelete = deleteCustomer.bind(null, c.id);

  return (
    <div>
      <Button render={<Link href="/klanten" />} variant="ghost" size="sm" className="mb-2 gap-1">
        <ChevronLeft className="size-4" /> Terug naar klanten
      </Button>
      <PageHeader
        title={c.company}
        action={
          <form action={doDelete}>
            <Button type="submit" variant="destructive" size="sm" className="gap-1">
              <Trash2 className="size-3.5" /> Verwijderen
            </Button>
          </form>
        }
      />
      <CustomerForm
        action={action}
        customer={{
          company: c.company,
          contact: c.contact ?? "",
          email: c.email ?? "",
          phone: c.phone ?? "",
          adres1: address.adres1 ?? "",
          adres2: address.adres2 ?? "",
        }}
      />
    </div>
  );
}
