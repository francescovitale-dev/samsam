import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatEur, sellCents } from "@/lib/money";
import { PRODUCT_CATEGORIES } from "@/lib/proposal/spec-fields";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CatalogusPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const products = await prisma.product.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });

  const byCategory = PRODUCT_CATEGORIES.map((c) => ({
    ...c,
    items: products.filter((p) => p.category === c.value),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <PageHeader
        title="Catalogus"
        description="De bron voor alle prijzen. Kostprijs + marge bepaalt de verkoopprijs in elke nieuwe offerte."
        action={
          <div className="flex gap-2">
            <Button
              render={<Link href="/catalogus/nieuw?category=battery" />}
              className="gap-2 bg-brand-lime text-brand-lime-ink hover:bg-brand-lime/90"
            >
              <Plus className="size-4" /> Nieuwe accu
            </Button>
            <Button render={<Link href="/catalogus/nieuw" />} variant="outline" className="gap-2">
              <Plus className="size-4" /> Nieuw item
            </Button>
          </div>
        }
      />

      {saved && <Banner>Product opgeslagen.</Banner>}
      {deleted && <Banner>Product verwijderd.</Banner>}

      <div className="space-y-8">
        {byCategory.map((group) => (
          <section key={group.value}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {group.label}
            </h2>
            <div className="overflow-hidden rounded-xl border bg-card">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 font-medium">Naam</th>
                    <th className="px-4 py-2 text-right font-medium">Kostprijs</th>
                    <th className="px-4 py-2 text-right font-medium">Marge</th>
                    <th className="px-4 py-2 text-right font-medium">Verkoopprijs</th>
                    <th className="px-4 py-2 text-center font-medium">Actief</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          {p.photoUrl && (
                            <Image
                              src={p.photoUrl}
                              alt=""
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded border object-contain p-0.5"
                            />
                          )}
                          <span className="font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right text-muted-foreground">{formatEur(p.costPrice)}</td>
                      <td className="px-4 py-2 text-right text-muted-foreground">{p.margin}%</td>
                      <td className="px-4 py-2 text-right font-semibold text-brand-teal">
                        {formatEur(sellCents(p.costPrice, p.margin))}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {p.active ? (
                          <span className="inline-block size-2 rounded-full bg-emerald-500" title="Actief" />
                        ) : (
                          <span className="inline-block size-2 rounded-full bg-zinc-300" title="Inactief" />
                        )}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <Button
                          render={<Link href={`/catalogus/${p.id}`} />}
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                        >
                          <Pencil className="size-3.5" /> Bewerk
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
        {byCategory.length === 0 && (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            Nog geen producten. Voeg je eerste accu toe.
          </div>
        )}
      </div>
    </div>
  );
}

function Banner({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{children}</div>;
}
