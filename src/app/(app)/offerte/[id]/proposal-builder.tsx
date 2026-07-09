"use client";

import { useId, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProposalDocument, type DocSettings } from "@/components/proposal/proposal-document";
import type { BatteryOption, ProposalData, TemplateType } from "@/lib/proposal/types";
import { BATTERY_SPEC_FIELDS } from "@/lib/proposal/spec-fields";
import { formatEur } from "@/lib/money";
import { statusLabel, statusClass } from "@/lib/status";
import { saveProposal, setProposalStatus, duplicateProposal, deleteProposal } from "../actions";
import { ChevronLeft, FileDown, Save, Calculator, ZoomIn, ZoomOut, Copy, Trash2 } from "lucide-react";

// ---- small field helpers ---------------------------------------------------

function Text({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Money({ label, cents, onCents }: { label: string; cents: number; onCents: (c: number) => void }) {
  const id = useId();
  const [str, setStr] = useState(String(cents / 100));
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          €
        </span>
        <Input
          id={id}
          className="pl-6"
          inputMode="decimal"
          value={str}
          onChange={(e) => {
            setStr(e.target.value);
            onCents(Math.round((parseFloat(e.target.value.replace(",", ".")) || 0) * 100));
          }}
        />
      </div>
    </div>
  );
}

function Percent({ label, value, onValue }: { label: string; value: number; onValue: (v: number) => void }) {
  const id = useId();
  const [str, setStr] = useState(String(value ?? 0));
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          className="pr-6"
          inputMode="decimal"
          value={str}
          onChange={(e) => {
            setStr(e.target.value);
            onValue(parseFloat(e.target.value.replace(",", ".")) || 0);
          }}
        />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          %
        </span>
      </div>
    </div>
  );
}

function Section({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="rounded-lg border bg-card">
      <summary className="cursor-pointer list-none px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </summary>
      <div className="space-y-3 border-t p-3">{children}</div>
    </details>
  );
}

// ---- builder ---------------------------------------------------------------

export function ProposalBuilder({
  proposalId,
  number,
  status,
  initialData,
  settings,
  catalogBatteries,
}: {
  proposalId: string;
  number: string;
  status: string;
  initialData: ProposalData;
  settings: DocSettings;
  catalogBatteries: { id: string; option: BatteryOption }[];
}) {
  const [data, setData] = useState<ProposalData>(initialData);
  const [dirty, setDirty] = useState(false);
  const [zoom, setZoom] = useState(0.55);
  const [pending, start] = useTransition();
  const [curStatus, setCurStatus] = useState(status);

  function update(mut: (d: ProposalData) => void) {
    setData((prev) => {
      const next = structuredClone(prev);
      mut(next);
      return next;
    });
    setDirty(true);
  }

  function save() {
    start(async () => {
      await saveProposal(proposalId, JSON.stringify(data));
      setDirty(false);
      toast.success("Offerte opgeslagen");
    });
  }

  const c = data.customer;
  const isCharger = data.templateType === "battery_charger";

  return (
    <div className="-m-6 flex h-[calc(100vh-0px)] flex-col">
      {/* top bar */}
      <div className="flex flex-wrap items-center gap-2 border-b bg-card px-4 py-2">
        <Button render={<Link href="/" />} variant="ghost" size="sm" className="gap-1">
          <ChevronLeft className="size-4" /> Terug
        </Button>
        <span className="font-mono text-sm font-medium">{number}</span>
        <select
          value={curStatus}
          onChange={(e) => {
            const v = e.target.value;
            setCurStatus(v);
            start(async () => {
              await setProposalStatus(proposalId, v);
            });
          }}
          className={`rounded-full border-0 px-2.5 py-0.5 text-xs font-medium ${statusClass(curStatus)}`}
        >
          <option value="draft">{statusLabel("draft")}</option>
          <option value="accepted">{statusLabel("accepted")}</option>
          <option value="rejected">{statusLabel("rejected")}</option>
        </select>
        {dirty && <span className="text-xs text-amber-600">• niet opgeslagen</span>}
        <div className="ml-auto flex items-center gap-2">
          <Button render={<Link href={`/offerte/${proposalId}/intern`} />} variant="outline" size="sm" className="gap-1">
            <Calculator className="size-4" /> Intern
          </Button>
          <Button
            render={<a href={`/offerte/${proposalId}/pdf`} target="_blank" rel="noreferrer" />}
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <FileDown className="size-4" /> PDF
          </Button>
          <Button
            onClick={save}
            disabled={pending}
            size="sm"
            className="gap-1 bg-brand-lime text-brand-lime-ink hover:bg-brand-lime/90"
          >
            <Save className="size-4" /> {pending ? "Bezig…" : "Opslaan"}
          </Button>
          <form action={duplicateProposal.bind(null, proposalId)}>
            <Button type="submit" variant="ghost" size="icon-sm" title="Dupliceren">
              <Copy className="size-4" />
            </Button>
          </form>
          <form
            action={deleteProposal.bind(null, proposalId)}
            onSubmit={(e) => {
              if (!confirm("Deze offerte verwijderen?")) e.preventDefault();
            }}
          >
            <Button type="submit" variant="ghost" size="icon-sm" className="text-destructive" title="Verwijderen">
              <Trash2 className="size-4" />
            </Button>
          </form>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* form */}
        <div className="w-[440px] shrink-0 space-y-3 overflow-auto border-r bg-muted/30 p-3">
          <Section title="Klant" open>
            <Text label="Bedrijfsnaam / klant" value={c.naam} onChange={(v) => update((d) => (d.customer.naam = v))} />
            <div className="grid grid-cols-2 gap-2">
              <Text label="Adres" value={c.adres1} onChange={(v) => update((d) => (d.customer.adres1 = v))} />
              <Text label="Postcode + plaats" value={c.adres2} onChange={(v) => update((d) => (d.customer.adres2 = v))} />
            </div>
            <Text label="Plaats, datum" value={c.plaatsdatum} onChange={(v) => update((d) => (d.customer.plaatsdatum = v))} placeholder="Utrecht, maandag 27 oktober 2025" />
            <div>
              <Label>Aanhef</Label>
              <select
                value={c.aanhef}
                onChange={(e) => update((d) => (d.customer.aanhef = e.target.value))}
                className="h-9 w-full rounded-md border bg-background px-2 text-sm"
              >
                {!["Geachte heer/mevrouw,", "Geachte heer,", "Geachte mevrouw,"].includes(c.aanhef) && (
                  <option value={c.aanhef}>{c.aanhef || "— kies —"}</option>
                )}
                <option value="Geachte heer/mevrouw,">Geachte heer/mevrouw,</option>
                <option value="Geachte heer,">Geachte heer,</option>
                <option value="Geachte mevrouw,">Geachte mevrouw,</option>
              </select>
            </div>
            <Text label="Referentie" value={c.referentie} onChange={(v) => update((d) => (d.customer.referentie = v))} />
            <div className="grid grid-cols-2 gap-2">
              <Text label="Contactpersoon" value={c.contact} onChange={(v) => update((d) => (d.customer.contact = v))} />
              <Text label="E-mail" value={c.email} onChange={(v) => update((d) => (d.customer.email = v))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Text label="Onderwerp" value={c.onderwerp} onChange={(v) => update((d) => (d.customer.onderwerp = v))} />
              <Text label="Geldigheid" value={c.geldigheid} onChange={(v) => update((d) => (d.customer.geldigheid = v))} />
            </div>
          </Section>

          <Section title="Template & ontwerp">
            <div>
              <Label>Template</Label>
              <select
                value={data.templateType}
                onChange={(e) => update((d) => (d.templateType = e.target.value as TemplateType))}
                className="h-9 w-full rounded-md border bg-background px-2 text-sm"
              >
                <option value="battery">Batterij</option>
                <option value="battery_charger">Batterij + lader</option>
              </select>
            </div>
            <div>
              <Label>Aantal kolommen</Label>
              <select
                value={data.cols}
                onChange={(e) => update((d) => (d.cols = Number(e.target.value) as 1 | 2 | 3))}
                className="h-9 w-full rounded-md border bg-background px-2 text-sm"
              >
                {[1, 2, 3].map((n) => (
                  <option key={n} value={n} disabled={n > data.batteries.length}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </Section>

          <Section title="Batterijen" open>
            {data.batteries.map((b, i) => (
              <details key={i} className="rounded-md border bg-background">
                <summary className="cursor-pointer list-none px-2 py-1.5 text-xs font-semibold text-brand-teal">
                  Kolom {i + 1}: {b.merk} {b.type}
                </summary>
                <div className="space-y-2 border-t p-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Text label="Merk" value={b.merk} onChange={(v) => update((d) => (d.batteries[i].merk = v))} />
                    <Text label="Type" value={b.type} onChange={(v) => update((d) => (d.batteries[i].type = v))} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Money
                      label="Inkoopprijs per unit"
                      cents={b.inkoop ?? 0}
                      onCents={(c2) =>
                        update((d) => {
                          const bat = d.batteries[i];
                          bat.inkoop = c2;
                          const sell = Math.round(c2 * (1 + (bat.margin ?? 0) / 100));
                          bat.prijs = sell;
                          bat.prijsInvest = sell;
                        })
                      }
                    />
                    <Percent
                      label="Marge"
                      value={b.margin ?? 0}
                      onValue={(m) =>
                        update((d) => {
                          const bat = d.batteries[i];
                          bat.margin = m;
                          const sell = Math.round((bat.inkoop ?? 0) * (1 + m / 100));
                          bat.prijs = sell;
                          bat.prijsInvest = sell;
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm">
                    <span className="text-muted-foreground">Totaalprijs per unit</span>
                    <span className="font-semibold text-brand-teal">
                      {formatEur(Math.round((b.inkoop ?? 0) * (1 + (b.margin ?? 0) / 100)))}
                    </span>
                  </div>
                  <details className="rounded border">
                    <summary className="cursor-pointer list-none px-2 py-1 text-xs text-muted-foreground">
                      Alle specificaties
                    </summary>
                    <div className="grid grid-cols-2 gap-2 p-2">
                      {BATTERY_SPEC_FIELDS.map((f) => (
                        <Text
                          key={f.key}
                          label={f.label}
                          value={String(b.specs[f.key as keyof typeof b.specs] ?? "")}
                          onChange={(v) =>
                            update((d) => {
                              // sterren numeric, rest string
                              (d.batteries[i].specs as unknown as Record<string, string | number>)[f.key] =
                                f.kind === "number" ? parseFloat(v.replace(",", ".")) || 0 : v;
                            })
                          }
                        />
                      ))}
                    </div>
                  </details>
                  {data.batteries.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() =>
                        update((d) => {
                          d.batteries.splice(i, 1);
                          if (d.cols > d.batteries.length) d.cols = (d.batteries.length || 1) as 1 | 2 | 3;
                        })
                      }
                    >
                      Verwijder kolom
                    </Button>
                  )}
                </div>
              </details>
            ))}
            {data.batteries.length < 3 && catalogBatteries.length > 0 && (
              <div>
                <Label>Batterij toevoegen uit catalogus</Label>
                <select
                  value=""
                  onChange={(e) => {
                    const found = catalogBatteries.find((x) => x.id === e.target.value);
                    if (found)
                      update((d) => {
                        d.batteries.push(structuredClone(found.option));
                        d.cols = Math.min(d.batteries.length, 3) as 1 | 2 | 3;
                      });
                  }}
                  className="h-9 w-full rounded-md border bg-background px-2 text-sm"
                >
                  <option value="">Kies een batterij…</option>
                  {catalogBatteries.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.option.merk} {x.option.type}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </Section>

          {isCharger && (
            <Section title="Lader" open>
              <div className="grid grid-cols-2 gap-2">
                <Text
                  label="Merk"
                  value={data.charger?.merk ?? ""}
                  onChange={(v) => update((d) => (d.charger = { ...(d.charger ?? { merk: "", type: "", prijs: 0 }), merk: v }))}
                />
                <Text
                  label="Type"
                  value={data.charger?.type ?? ""}
                  onChange={(v) => update((d) => (d.charger = { ...(d.charger ?? { merk: "", type: "", prijs: 0 }), type: v }))}
                />
              </div>
              <Text
                label="Vermogen"
                value={data.charger?.vermogen ?? ""}
                onChange={(v) => update((d) => (d.charger = { ...(d.charger ?? { merk: "", type: "", prijs: 0 }), vermogen: v }))}
              />
              <Money
                label="Prijs lader"
                cents={data.charger?.prijs ?? 0}
                onCents={(c2) => update((d) => (d.charger = { ...(d.charger ?? { merk: "", type: "", prijs: 0 }), prijs: c2 }))}
              />
            </Section>
          )}

          <Section title="Investering (prijstabel)" open>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal">Standaard</p>
            <div className="grid grid-cols-2 gap-2">
              <Money label="Transport en afval" cents={data.investering.transport} onCents={(v) => update((d) => (d.investering.transport = v))} />
              <Money label="ROEF" cents={data.investering.roef} onCents={(v) => update((d) => (d.investering.roef = v))} />
              <Money label="Keuring NEN-1010" cents={data.investering.keuring} onCents={(v) => update((d) => (d.investering.keuring = v))} />
            </div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Optioneel</p>
            <div className="grid grid-cols-2 gap-2">
              <Money label="Hekwerk / betonwering" cents={data.investering.hekwerk} onCents={(v) => update((d) => (d.investering.hekwerk = v))} />
              <Money label="Grondwerk" cents={data.investering.grondwerk} onCents={(v) => update((d) => (d.investering.grondwerk = v))} />
              <Money label="AC (stelpost)" cents={data.investering.ac} onCents={(v) => update((d) => (d.investering.ac = v))} />
              <Money label="EMS system" cents={data.investering.ems} onCents={(v) => update((d) => (d.investering.ems = v))} />
            </div>
          </Section>

          <Section title="Jaarlijkse kosten + BTW">
            <Money label="EMS jaarlijks" cents={data.jaarlijks.ems} onCents={(v) => update((d) => (d.jaarlijks.ems = v))} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Onderhoud BSS — aantal / MW</Label>
                <select
                  value={data.jaarlijks.bssConfig}
                  onChange={(e) => update((d) => (d.jaarlijks.bssConfig = e.target.value as ProposalData["jaarlijks"]["bssConfig"]))}
                  className="h-9 w-full rounded-md border bg-background px-2 text-sm"
                >
                  {["1", "2", "3", "4", "5", "MW"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <Money label="Onderhoud BSS (€/jaar)" cents={data.jaarlijks.onderhoudBss} onCents={(v) => update((d) => (d.jaarlijks.onderhoudBss = v))} />
            </div>
            {isCharger && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Lader</Label>
                  <select
                    value={data.jaarlijks.laderType}
                    onChange={(e) => update((d) => (d.jaarlijks.laderType = e.target.value as ProposalData["jaarlijks"]["laderType"]))}
                    className="h-9 w-full rounded-md border bg-background px-2 text-sm"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                  </select>
                </div>
                <div>
                  <Label>Aantal</Label>
                  <select
                    value={data.jaarlijks.laderCount}
                    onChange={(e) => update((d) => (d.jaarlijks.laderCount = e.target.value as ProposalData["jaarlijks"]["laderCount"]))}
                    className="h-9 w-full rounded-md border bg-background px-2 text-sm"
                  >
                    {["1", "2", "3"].map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <Money label="Onderhoud lader (€/jaar)" cents={data.jaarlijks.onderhoudLader} onCents={(v) => update((d) => (d.jaarlijks.onderhoudLader = v))} />
              </div>
            )}
            <div>
              <Label>BTW %</Label>
              <Input
                inputMode="decimal"
                value={String(data.btwRate)}
                onChange={(e) => update((d) => (d.btwRate = parseFloat(e.target.value.replace(",", ".")) || 0))}
              />
            </div>
          </Section>
        </div>

        {/* preview */}
        <div className="min-w-0 flex-1 overflow-auto bg-muted/50">
          <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-card/80 px-3 py-1.5 backdrop-blur">
            <span className="text-xs text-muted-foreground">Voorbeeld</span>
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}>
                <ZoomOut className="size-4" />
              </Button>
              <span className="w-10 text-center text-xs tabular-nums">{Math.round(zoom * 100)}%</span>
              <Button variant="ghost" size="icon-sm" onClick={() => setZoom((z) => Math.min(1, z + 0.1))}>
                <ZoomIn className="size-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-center p-4">
            <div style={{ zoom }}>
              <ProposalDocument data={data} settings={settings} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
