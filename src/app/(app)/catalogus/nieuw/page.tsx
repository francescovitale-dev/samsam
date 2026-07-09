import Link from "next/link";
import { requireUser } from "@/lib/auth-guard";
import { getSettings } from "@/lib/settings";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "../product-form";
import { saveProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  await requireUser();
  const { category } = await searchParams;
  const settings = await getSettings();

  const action = saveProduct.bind(null, null);

  return (
    <div>
      <Button render={<Link href="/catalogus" />} variant="ghost" size="sm" className="mb-2 gap-1">
        <ChevronLeft className="size-4" /> Terug naar catalogus
      </Button>
      <PageHeader title="Nieuw product" description="Voeg een batterij, werkzaamheid, EMS, optie of lader toe." />
      <ProductForm
        action={action}
        product={{
          name: "",
          category: category ?? "work",
          costPriceEuros: "",
          margin: String(settings.defaultMargin),
          unit: "st",
          active: true,
        }}
      />
    </div>
  );
}
