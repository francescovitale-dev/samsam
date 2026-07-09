import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { computeTotals } from "@/lib/proposal/compute";
import { formatEur } from "@/lib/money";
import type { CostInputs, ProposalData } from "@/lib/proposal/types";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InternalMarginPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const proposal = await prisma.proposal.findUnique({ where: { id } });
  if (!proposal) notFound();

  const data = proposal.data as unknown as ProposalData;
  const costInputs = (proposal.totals as { costInputs?: CostInputs } | null)?.costInputs;
  const totals = computeTotals(data, costInputs);
  const cols = data.batteries.slice(0, data.cols);

  return (
    <div>
      <Button render={<Link href={`/offerte/${id}`} />} variant="ghost" size="sm" className="mb-2 gap-1">
        <ChevronLeft className="size-4" /> Terug naar offerte
      </Button>
      <PageHeader
        title="Interne marge"
        description="Alleen intern zichtbaar — nooit onderdeel van de offerte aan de klant."
      />

      <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
        <Lock className="size-4" /> Vertrouwelijk. Deze cijfers verschijnen niet in de PDF of de klantweergave.
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Kolom</th>
              <th className="px-4 py-2 text-right font-medium">Verkoop excl. BTW</th>
              <th className="px-4 py-2 text-right font-medium">Kostprijs</th>
              <th className="px-4 py-2 text-right font-medium">Brutomarge</th>
              <th className="px-4 py-2 text-right font-medium">Marge %</th>
            </tr>
          </thead>
          <tbody>
            {totals.columns.map((col, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="px-4 py-2 font-medium">
                  {cols[i].merk} {cols[i].type}
                </td>
                <td className="px-4 py-2 text-right">{formatEur(col.exclBTW)}</td>
                <td className="px-4 py-2 text-right text-muted-foreground">
                  {col.cost != null ? formatEur(col.cost) : "—"}
                </td>
                <td className="px-4 py-2 text-right font-semibold text-emerald-600">
                  {col.grossMargin != null ? formatEur(col.grossMargin) : "—"}
                </td>
                <td className="px-4 py-2 text-right">
                  {col.grossMarginPct != null ? `${col.grossMarginPct.toFixed(1)}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!costInputs && (
        <p className="mt-3 text-xs text-muted-foreground">
          Geen kostprijs-momentopname beschikbaar; marge kan niet exact worden getoond.
        </p>
      )}
    </div>
  );
}
