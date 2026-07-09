import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatEur } from "@/lib/money";
import { statusLabel, statusClass } from "@/lib/status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import type { ProposalTotals } from "@/lib/proposal/types";

export const dynamic = "force-dynamic";

function headlineTotal(totals: unknown): string {
  const t = totals as ProposalTotals | null;
  const col = t?.columns?.[0];
  return col ? formatEur(col.inclBTW) : "—";
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; deleted?: string }>;
}) {
  const { q, status, deleted } = await searchParams;

  const proposals = await prisma.proposal.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { number: { contains: q, mode: "insensitive" } },
              { customer: { company: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  const statuses = ["", "draft", "accepted", "rejected"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Offertes</h1>
          <p className="text-sm text-muted-foreground">
            {proposals.length} offerte{proposals.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button
          render={<Link href="/offerte/nieuw" />}
          className="gap-2 bg-brand-lime text-brand-lime-ink hover:bg-brand-lime/90"
        >
          <Plus className="size-4" /> Nieuwe offerte
        </Button>
      </div>

      {deleted && (
        <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">Offerte verwijderd.</div>
      )}

      <form className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Zoek op klant of offertenummer…" className="pl-9" />
        </div>
        <div className="flex gap-1">
          {statuses.map((s) => (
            <Button
              key={s || "all"}
              render={
                <Link href={{ pathname: "/", query: { ...(q ? { q } : {}), ...(s ? { status: s } : {}) } }} />
              }
              variant={status === s || (!status && !s) ? "default" : "outline"}
              size="sm"
            >
              {s ? statusLabel(s) : "Alle"}
            </Button>
          ))}
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Nummer</th>
              <th className="px-4 py-3 font-medium">Klant</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 text-right font-medium">Totaal incl. BTW</th>
            </tr>
          </thead>
          <tbody>
            {proposals.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  Nog geen offertes. Maak je eerste offerte aan.
                </td>
              </tr>
            )}
            {proposals.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">
                  <Link href={`/offerte/${p.id}`} className="font-medium text-brand-teal hover:underline">
                    {p.number}
                  </Link>
                </td>
                <td className="px-4 py-3">{p.customer.company}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(p.status)}`}>
                    {statusLabel(p.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.templateType === "battery_charger" ? "Batterij + lader" : "Batterij"}
                </td>
                <td className="px-4 py-3 text-right font-medium">{headlineTotal(p.totals)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
