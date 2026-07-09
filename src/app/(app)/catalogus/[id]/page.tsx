import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trash2 } from "lucide-react";
import { ProductForm } from "../product-form";
import { saveProduct, deleteProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) notFound();

  const specs = (p.specs as Record<string, string | number> | null) ?? undefined;
  const action = saveProduct.bind(null, p.id);
  const doDelete = deleteProduct.bind(null, p.id);

  return (
    <div>
      <Button render={<Link href="/catalogus" />} variant="ghost" size="sm" className="mb-2 gap-1">
        <ChevronLeft className="size-4" /> Terug naar catalogus
      </Button>
      <PageHeader
        title={p.name}
        description="Wijzig prijs, marge of specificaties."
        action={
          <form action={doDelete}>
            <Button type="submit" variant="destructive" size="sm" className="gap-1">
              <Trash2 className="size-3.5" /> Verwijderen
            </Button>
          </form>
        }
      />
      <ProductForm
        action={action}
        product={{
          id: p.id,
          name: p.name,
          category: p.category,
          costPriceEuros: (p.costPrice / 100).toFixed(2),
          margin: String(p.margin),
          unit: p.unit,
          active: p.active,
          photoUrl: p.photoUrl,
          merk: typeof specs?.merk === "string" ? specs.merk : "",
          type: typeof specs?.type === "string" ? specs.type : "",
          specs,
        }}
      />
    </div>
  );
}
