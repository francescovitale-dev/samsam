import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function KlantenPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; blocked?: string }>;
}) {
  const { saved, deleted, blocked } = await searchParams;
  const customers = await prisma.customer.findMany({
    orderBy: { company: "asc" },
    include: { _count: { select: { proposals: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Klanten"
        description="Beheer klanten voor hergebruik bij nieuwe offertes."
        action={
          <Button
            render={<Link href="/klanten/nieuw" />}
            className="gap-2 bg-brand-lime text-brand-lime-ink hover:bg-brand-lime/90"
          >
            <Plus className="size-4" /> Nieuwe klant
          </Button>
        }
      />

      {saved && <Banner tone="ok">Klant opgeslagen.</Banner>}
      {deleted && <Banner tone="ok">Klant verwijderd.</Banner>}
      {blocked && <Banner tone="warn">Kan klant niet verwijderen: er zijn nog offertes gekoppeld.</Banner>}

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Bedrijf</th>
              <th className="px-4 py-2 font-medium">Contact</th>
              <th className="px-4 py-2 font-medium">E-mail</th>
              <th className="px-4 py-2 text-right font-medium">Offertes</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  Nog geen klanten.
                </td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-2 font-medium">{c.company}</td>
                <td className="px-4 py-2 text-muted-foreground">{c.contact ?? "—"}</td>
                <td className="px-4 py-2 text-muted-foreground">{c.email ?? "—"}</td>
                <td className="px-4 py-2 text-right text-muted-foreground">{c._count.proposals}</td>
                <td className="px-4 py-2 text-right">
                  <Button render={<Link href={`/klanten/${c.id}`} />} variant="ghost" size="sm" className="gap-1">
                    <Pencil className="size-3.5" /> Bewerk
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Banner({ children, tone }: { children: React.ReactNode; tone: "ok" | "warn" }) {
  const cls = tone === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800";
  return <div className={`mb-4 rounded-lg px-4 py-2 text-sm ${cls}`}>{children}</div>;
}
