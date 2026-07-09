import { getSettings } from "@/lib/settings";
import { requireUser } from "@/lib/auth-guard";
import { updateSettings } from "./actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

function Field({
  name,
  label,
  defaultValue,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  type?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {children}
    </div>
  );
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireUser();
  const s = await getSettings();
  const { saved } = await searchParams;

  return (
    <div>
      <PageHeader title="Instellingen" description="Bedrijfsgegevens, merk, standaarden en vaste teksten." />

      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          <CheckCircle2 className="size-4" /> Instellingen opgeslagen.
        </div>
      )}

      <form action={updateSettings} className="space-y-5">
        <Section title="Bedrijf">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Bedrijfsnaam" defaultValue={s.company.name} />
            <Field name="tagline" label="Tagline" defaultValue={s.company.tagline} />
            <Field name="address1" label="Adres regel 1" defaultValue={s.company.address1} />
            <Field name="address2" label="Adres regel 2" defaultValue={s.company.address2} />
            <Field name="kvk" label="KVK" defaultValue={s.company.kvk} />
            <Field name="btwNr" label="BTW-nummer" defaultValue={s.company.btwNr} />
            <Field name="iban" label="IBAN" defaultValue={s.company.iban} />
            <Field name="partner" label="Uitvoerend partner" defaultValue={s.company.partner} />
            <Field name="contact" label="Contactpersoon" defaultValue={s.company.contact} />
            <Field name="email" label="E-mail" defaultValue={s.company.email} />
            <Field name="phone" label="Telefoon" defaultValue={s.company.phone} />
            <Field name="web" label="Website" defaultValue={s.company.web} />
          </div>
        </Section>

        <Section title="Merk & standaarden">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="accent">Accentkleur (lime)</Label>
              <div className="flex gap-2">
                <Input id="accent" name="accent" defaultValue={s.accent} />
                <input type="color" defaultValue={s.accent} className="h-9 w-12 rounded border" aria-hidden readOnly />
              </div>
            </div>
            <div>
              <Label htmlFor="teal">Tweede kleur (teal)</Label>
              <div className="flex gap-2">
                <Input id="teal" name="teal" defaultValue={s.teal} />
                <input type="color" defaultValue={s.teal} className="h-9 w-12 rounded border" aria-hidden readOnly />
              </div>
            </div>
            <Field name="defaultMargin" label="Standaard marge (%)" defaultValue={s.defaultMargin} type="number" />
            <Field name="btwRate" label="BTW-tarief (%)" defaultValue={s.btwRate} type="number" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Het logo staat op <code>/public/brand/logo.png</code>. Upload via de catalogus/branding volgt later.
          </p>
        </Section>

        <Section title="Vaste tekst — begeleidende brief">
          <Label htmlFor="letter">Brieftekst (pagina 2)</Label>
          <Textarea id="letter" name="letter" defaultValue={s.fixedCopy.letter} rows={10} className="font-mono text-xs" />
          <p className="mt-2 text-xs text-muted-foreground">
            De overige vaste teksten (marketingpagina&apos;s, voorwaarden) worden in een latere iteratie bewerkbaar.
          </p>
        </Section>

        <div className="flex justify-end">
          <Button type="submit" className="bg-brand-lime text-brand-lime-ink hover:bg-brand-lime/90">
            Opslaan
          </Button>
        </div>
      </form>
    </div>
  );
}
