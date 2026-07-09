import Link from "next/link";
import { requireUser } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createProposal } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProposalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser();
  const { error } = await searchParams;
  const customers = await prisma.customer.findMany({ orderBy: { company: "asc" } });

  if (customers.length === 0) {
    return (
      <div>
        <PageHeader title="Nieuwe offerte" />
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          Voeg eerst een klant toe.
          <div className="mt-4">
            <Button render={<Link href="/klanten/nieuw" />} className="bg-brand-lime text-brand-lime-ink">
              Nieuwe klant
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="Nieuwe offerte" description="Kies klant, template en ontwerp om te starten." />
      {error === "customer" && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
          Kies een geldige klant.
        </div>
      )}
      <form action={createProposal} className="space-y-5 rounded-xl border bg-card p-6">
        <div>
          <Label htmlFor="customerId">Klant</Label>
          <select
            id="customerId"
            name="customerId"
            required
            className="h-9 w-full rounded-md border bg-background px-2 text-sm"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="templateType">Template</Label>
          <select
            id="templateType"
            name="templateType"
            className="h-9 w-full rounded-md border bg-background px-2 text-sm"
          >
            <option value="battery">Batterij</option>
            <option value="battery_charger">Batterij + lader</option>
          </select>
        </div>

        <div>
          <Label htmlFor="design">Ontwerp</Label>
          <select
            id="design"
            name="design"
            className="h-9 w-full rounded-md border bg-background px-2 text-sm"
          >
            <option value="modern">Modern</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <Button render={<Link href="/" />} variant="outline">
            Annuleren
          </Button>
          <Button type="submit" className="bg-brand-lime text-brand-lime-ink hover:bg-brand-lime/90">
            Offerte aanmaken
          </Button>
        </div>
      </form>
    </div>
  );
}
