"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BATTERY_SPEC_FIELDS, PRODUCT_CATEGORIES } from "@/lib/proposal/spec-fields";
import { formatEur } from "@/lib/money";

export interface ProductFormData {
  id?: string;
  name: string;
  category: string;
  costPriceEuros: string;
  margin: string;
  unit: string;
  active: boolean;
  photoUrl?: string | null;
  merk?: string;
  type?: string;
  specs?: Record<string, string | number>;
}

export function ProductForm({
  product,
  action,
}: {
  product: ProductFormData;
  action: (formData: FormData) => void;
}) {
  const [category, setCategory] = useState(product.category);
  const [cost, setCost] = useState(product.costPriceEuros);
  const [margin, setMargin] = useState(product.margin);

  const isBatteryLike = category === "battery" || category === "charger";
  const costCents = Math.round((parseFloat(cost.replace(",", ".")) || 0) * 100);
  const marginPct = parseFloat(margin.replace(",", ".")) || 0;
  const sell = Math.round(costCents * (1 + marginPct / 100));

  return (
    <form action={action} className="space-y-5">
      {product.photoUrl && <input type="hidden" name="existingPhotoUrl" value={product.photoUrl} />}

      <div className="rounded-xl border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">Categorie</Label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-9 w-full rounded-md border bg-background px-2 text-sm"
            >
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="unit">Eenheid</Label>
            <Input id="unit" name="unit" defaultValue={product.unit} placeholder="st" />
          </div>

          {isBatteryLike ? (
            <>
              <div>
                <Label htmlFor="merk">Merk</Label>
                <Input id="merk" name="merk" defaultValue={product.merk ?? ""} placeholder="Huawei" required />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Input id="type" name="type" defaultValue={product.type ?? ""} placeholder="LUNA 215" required />
              </div>
            </>
          ) : (
            <div className="sm:col-span-2">
              <Label htmlFor="name">Naam</Label>
              <Input id="name" name="name" defaultValue={product.name} placeholder="Transportkosten en afval" required />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Prijs</h2>
        <div className="grid items-end gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="costPrice">Kostprijs (€, excl. BTW)</Label>
            <Input
              id="costPrice"
              name="costPrice"
              inputMode="decimal"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="46434.78"
            />
          </div>
          <div>
            <Label htmlFor="margin">Marge (%)</Label>
            <Input
              id="margin"
              name="margin"
              inputMode="decimal"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              placeholder="15"
            />
          </div>
          <div>
            <Label>Verkoopprijs (live)</Label>
            <div className="flex h-9 items-center rounded-md border bg-muted/40 px-3 text-sm font-semibold text-brand-teal">
              {formatEur(sell)}
            </div>
          </div>
        </div>
      </div>

      {isBatteryLike && (
        <div className="rounded-xl border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Specificaties
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BATTERY_SPEC_FIELDS.map((f) => (
              <div key={f.key}>
                <Label htmlFor={`spec_${f.key}`}>{f.label}</Label>
                <Input
                  id={`spec_${f.key}`}
                  name={`spec_${f.key}`}
                  type={f.kind === "number" ? "number" : "text"}
                  step={f.kind === "number" ? "0.5" : undefined}
                  defaultValue={product.specs?.[f.key] ?? ""}
                />
              </div>
            ))}
          </div>

          <div className="mt-5">
            <Label htmlFor="photo">Foto</Label>
            <div className="flex items-center gap-4">
              {product.photoUrl && (
                <Image
                  src={product.photoUrl}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded border object-contain p-1"
                />
              )}
              <Input id="photo" name="photo" type="file" accept="image/*" className="max-w-xs" />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={product.active} className="size-4" />
          Actief (zichtbaar in offertes)
        </label>
        <Button type="submit" className="bg-brand-lime text-brand-lime-ink hover:bg-brand-lime/90">
          Opslaan
        </Button>
      </div>
    </form>
  );
}
