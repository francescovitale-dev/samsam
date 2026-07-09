import { formatEur, formatEur2, stars, parseKwh } from "@/lib/money";
import { computeTotals } from "@/lib/proposal/compute";
import type { ProposalData } from "@/lib/proposal/types";
import { BATTERY_SPEC_FIELDS } from "@/lib/proposal/spec-fields";
import type { FixedCopy } from "@/lib/content/fix";
import { proposalCss } from "./proposal-styles";

export interface DocSettings {
  company: {
    name: string;
    tagline: string;
    web: string;
    address1: string;
    address2: string;
    iban: string;
    btwNr: string;
    kvk: string;
    email: string;
    contact: string;
    partner: string;
  };
  fixedCopy: FixedCopy;
  logoUrl: string;
  accent: string;
  teal: string;
}

export interface SignatureData {
  name: string;
  email: string;
  chosenIndex?: number;
  signatureImgUrl?: string;
  signedAt?: string;
}

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\n+/).map((para, i) => (
        <p key={i}>
          {para.split("\n").map((line, j) => (
            <span key={j}>
              {line}
              {j < para.split("\n").length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </>
  );
}

function Head({ s, pn }: { s: DocSettings; pn?: number }) {
  return (
    <div className="phead">
      <div className="brandwrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="logo" src={s.logoUrl} alt={s.company.name} />
        <div className="hr">
          <b>Delen</b>
          <b className="t">{s.company.tagline}</b>
          <span className="u">{s.company.web}</span>
        </div>
      </div>
      {pn ? <div className="pnum">Pagina {pn}</div> : null}
    </div>
  );
}

export function ProposalDocument({
  data,
  settings,
  signature,
}: {
  data: ProposalData;
  settings: DocSettings;
  signature?: SignatureData | null;
}) {
  const s = settings;
  const fix = settings.fixedCopy;
  const c = data.customer;
  const chargers = data.chargers ?? [];
  const isCharger = chargers.length > 0;
  const bs = data.batteries.slice(0, data.cols);
  const totals = computeTotals(data);
  const inv = data.investering;

  return (
    <div
      className="samsam-doc"
      style={{ ["--lime" as string]: s.accent, ["--teal" as string]: s.teal }}
    >
      <style dangerouslySetInnerHTML={{ __html: proposalCss(s.accent, s.teal) }} />

      {/* 1 — Cover */}
      <section className="page cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="big" src={s.logoUrl} alt={s.company.name} />
        <div className="cust">{c.naam}</div>
        <div className="subject">{c.onderwerp}</div>
        <div className="zk">
          <div className="s">In samenwerking met</div>
          <div className="z">
            {s.company.partner}
            <b> ⚡</b>
          </div>
        </div>
      </section>

      {/* 2 — Letter */}
      <section className="page">
        <Head s={s} pn={2} />
        <div className="panel">
          <b>{c.naam}</b>
          <br />
          {c.adres1}
          <br />
          {c.adres2}
        </div>
        <div className="panel mt" style={{ textAlign: "right" }}>
          {c.plaatsdatum}
        </div>
        <div className="panel mt">
          <table className="metaTbl">
            <tbody>
              <tr>
                <td>Referentie</td>
                <td>{c.referentie}</td>
              </tr>
              <tr>
                <td>Contactpersoon</td>
                <td>{c.contact}</td>
              </tr>
              <tr>
                <td>Contactgegevens</td>
                <td className="mail">{c.email}</td>
              </tr>
              <tr>
                <td>Onderwerp</td>
                <td>{c.onderwerp}</td>
              </tr>
              <tr>
                <td>Geldigheid</td>
                <td>{c.geldigheid}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="panel mt">
          <p>{c.aanhef}</p>
          <Paragraphs text={fix.letter} />
          <p>
            Met vriendelijke groet,
            <br />
            <br />
            {s.company.contact}
            <br />
            {s.company.name}
          </p>
        </div>
      </section>

      {/* 3 — Partner */}
      <section className="page">
        <Head s={s} pn={3} />
        <h2 className="sec-h">Een partner voor al uw energievraagstukken</h2>
        <p>
          Bij {s.company.name} geloven we in een aanpak die helder en compleet is: wij zijn uw
          &lsquo;one stop shop&rsquo; voor duurzame energieoplossingen. Van advies tot installatie, van
          subsidieaanvraag tot onderhoud — wij staan aan uw zijde in elke stap.
        </p>
        <div className="three-ico">
          {fix.partner.map((p, i) => (
            <div className="it" key={i}>
              <div className="dot" />
              <div>
                <b>{p[0]}</b>
                <br />
                {p[1]}
              </div>
            </div>
          ))}
        </div>
        <p className="mt">
          Met {s.company.name} kiest u voor een partner die niet alleen vandaag met u meedenkt, maar
          ook morgen blijft zorgen voor optimale prestaties en rendement.
        </p>
        <div className="sidebox">{fix.partnerBox}</div>
      </section>

      {/* 4 — Kwaliteit */}
      <section className="page">
        <Head s={s} pn={4} />
        <h2 className="sec-h">Ga voor kwaliteit</h2>
        <Paragraphs text={fix.kwaliteit} />
        <div className="sidebox">{fix.kwaliteitBox}</div>
        <h3 style={{ marginTop: 18 }}>Meer dan 1000 groot-zakelijke projecten</h3>
        <p>{fix.duizend}</p>
      </section>

      {/* 5 — Comparison */}
      <section className="page">
        <Head s={s} pn={5} />
        <div className="barTitle">Energie-opslagsystemen</div>
        <div className="sideLabel">Vergelijking Opslagsysteem</div>
        <table className="cmp" style={{ marginTop: 2 }}>
          <tbody>
            <tr className="photos">
              <td className="lbl"></td>
              {bs.map((b, i) => (
                <td key={i}>
                  {b.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.photoUrl} alt={b.merk} />
                  ) : null}
                </td>
              ))}
            </tr>
            <tr className="merk">
              <td className="lbl">Merk</td>
              {bs.map((b, i) => (
                <td key={i}>{b.merk}</td>
              ))}
            </tr>
            <tr>
              <td className="lbl">Type</td>
              {bs.map((b, i) => (
                <td key={i}>{b.type}</td>
              ))}
            </tr>
            {BATTERY_SPEC_FIELDS.filter((f) => f.key !== "sterren").map((f) => (
              <tr key={f.key}>
                <td className="lbl">{f.label}</td>
                {bs.map((b, i) => (
                  <td key={i}>{String(b.specs[f.key as keyof typeof b.specs] ?? "")}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="lbl">Ons kwaliteitsoordeel</td>
              {bs.map((b, i) => (
                <td key={i}>
                  <span className="stars">{stars(b.specs.sterren)}</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <div
          className="prijsbar"
          style={{ gridTemplateColumns: `1.4fr ${bs.map(() => "1fr").join(" ")}` }}
        >
          <div className="pl">Prijs per Unit</div>
          {bs.map((b, i) => (
            <div key={i}>{formatEur(b.prijs)}</div>
          ))}
        </div>
        {chargers.map((ch, i) => (
          <div
            key={i}
            className="mt"
            style={{
              marginTop: i === 0 ? 10 : 4,
              padding: "8px 14px",
              borderRadius: 10,
              background: "var(--teal)",
              color: "#fff",
              fontSize: 11,
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <span>
              <b>Inclusief lader</b> — {ch.merk} {ch.type}
              {ch.vermogen ? ` (${ch.vermogen})` : ""}
            </span>
            <b>{formatEur(ch.prijs)}</b>
          </div>
        ))}
        <div className="panel mt" style={{ fontSize: 11 }}>
          Onze ADR-gecertificeerde vervoerder levert de batterijen (ca. 3.000 kg per unit) veilig en
          zet ze direct op de fundatie. Restmateriaal nemen we meteen voor u mee.
        </div>
      </section>

      {/* 6 — Werk 1 */}
      <section className="page">
        <Head s={s} pn={6} />
        <h2 className="sec-h">Overige werkzaamheden</h2>
        <WorkItem title="Fundatie, grondwerk & ROEF" text={fix.fundatie} amt={`Stelpost ${formatEur(inv.roef + inv.grondwerk)}`} partner={s.company.partner} />
        <WorkItem title="Hekwerk / Brandmuur" text={fix.hekwerk} amt={formatEur(inv.hekwerk)} partner={s.company.partner} />
        <WorkItem title="Keuring NEN-1010" text={fix.keuring} amt={formatEur(inv.keuring)} partner={s.company.partner} />
      </section>

      {/* 7 — Werk 2 */}
      <section className="page">
        <Head s={s} pn={7} />
        <h2 className="sec-h">Overige werkzaamheden</h2>
        <WorkItem title="AC Werkzaamheden" text={fix.ac} amt={`Stelpost ${formatEur(inv.ac)}`} partner={s.company.partner} />
      </section>

      {/* 8 — EMS + Onderhoud */}
      <section className="page">
        <Head s={s} pn={8} />
        <h2 className="sec-h">Handelen met stroom</h2>
        <WorkItem
          title="EMS – SmartBox Power"
          text={fix.ems}
          amt={`Eenmalig ${formatEur(inv.ems)}`}
          partner={s.company.partner}
        />
        <h2 className="sec-h mt">Onderhoud Opslagsysteem</h2>
        <WorkItem title="Jaarlijks onderhoud" text={fix.onderhoud} amt={`${formatEur(data.jaarlijks.onderhoudBss)} / jaar`} partner={s.company.partner} />
      </section>

      {/* 9 — Betaling */}
      <section className="page">
        <Head s={s} pn={9} />
        <h2 className="sec-h">Betalingsvoorwaarden</h2>
        <p>Om de voortgang van het project te waarborgen, hanteren wij de volgende betalingsvoorwaarden:</p>
        {fix.betaling.map((b, i) => (
          <div className="mt" key={i}>
            <b style={{ color: "var(--teal)" }}>{b[0]}</b>
            <br />
            {b[1]}
          </div>
        ))}
        <h3 style={{ marginTop: 18 }}>Voorwaarden</h3>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          {fix.voorwaarden.map((v, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              {v}
            </li>
          ))}
        </ul>
      </section>

      {/* 10 — Investering */}
      <section className="page">
        <Head s={s} pn={10} />
        <div className="barTitle">Eenmalige investering</div>
        <table className="inv" style={{ marginTop: 14 }}>
          <tbody>
            <tr className="merkrow">
              <td></td>
              <td></td>
              <td colSpan={bs.length}>Merk</td>
            </tr>
            <tr>
              <th>Omschrijving</th>
              <th className="num">Aantal</th>
              {bs.map((b, i) => (
                <th key={i} className="num" style={{ textAlign: "center" }}>
                  {b.merk}
                  <br />
                  {b.type}
                </th>
              ))}
            </tr>
            <RowPer label="Prijs batterijen" aantal="1" bs={bs} render={(b) => formatEur(b.prijsInvest)} />
            {chargers.map((ch, i) => (
              <RowShared key={i} label={`Lader — ${ch.merk} ${ch.type}`} cols={bs.length} value={formatEur(ch.prijs)} />
            ))}
            <GroupRow cols={bs.length}>Standaard</GroupRow>
            <RowShared label="– Transportkosten en afval" cols={bs.length} value={formatEur(inv.transport)} />
            <RowShared label="– Fundatie / ROEF verhogingsbalken" cols={bs.length} value={formatEur(inv.roef)} />
            <RowShared label="– Keuring NEN-1010" cols={bs.length} value={formatEur(inv.keuring)} />
            <GroupRow cols={bs.length}>Optioneel</GroupRow>
            <RowShared label="– Hekwerk / brandvertragende betonwering" cols={bs.length} value={formatEur(inv.hekwerk)} />
            <RowShared label="– Grondwerkzaamheden" cols={bs.length} value={formatEur(inv.grondwerk)} />
            <RowShared label="– AC werkzaamheden (stelpost)" cols={bs.length} value={formatEur(inv.ac)} />
            <RowShared label="– EMS system (SmartBox Power)" cols={bs.length} value={formatEur(inv.ems)} />
            <tr className="tot">
              <td>Totaal Excl. BTW</td>
              <td></td>
              {totals.columns.map((col, i) => (
                <td key={i} className="num" style={{ textAlign: "center" }}>
                  {formatEur(col.exclBTW)}
                </td>
              ))}
            </tr>
            <tr>
              <td>Totaal vermogen</td>
              <td></td>
              {bs.map((b, i) => (
                <td key={i} className="num" style={{ textAlign: "center" }}>
                  {b.specs.vermogen}kW / {b.specs.capaciteit}
                </td>
              ))}
            </tr>
            <tr>
              <td>Prijs per kWh</td>
              <td></td>
              {totals.columns.map((col, i) => (
                <td key={i} className="num" style={{ textAlign: "center" }}>
                  {formatEur2(col.pricePerKwhCents)}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <b>Uw Keuze</b>
              </td>
              <td></td>
              {bs.map((_, i) => (
                <td key={i} style={{ textAlign: "center" }}>
                  <span
                    className="keuze"
                    style={
                      signature?.chosenIndex === i
                        ? { background: "var(--teal)" }
                        : undefined
                    }
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </section>

      {/* 11 — Jaarlijkse kosten */}
      <section className="page">
        <Head s={s} pn={11} />
        <div className="barTitle">Jaarlijkse kosten</div>
        <table className="inv" style={{ marginTop: 14 }}>
          <tbody>
            <tr>
              <th>Omschrijving</th>
              <th className="num" style={{ textAlign: "center" }}>
                Bedrag
              </th>
            </tr>
            <tr>
              <td>EMS jaarlijkse kosten</td>
              <td className="num" style={{ textAlign: "center" }}>
                {formatEur(data.jaarlijks.ems)}
              </td>
            </tr>
            <tr>
              <td>
                Onderhoud batterijopslag (BSS)
                {` — ${data.jaarlijks.bssConfig === "MW" ? "per MW" : `${data.jaarlijks.bssConfig} unit(s)`}`}
              </td>
              <td className="num" style={{ textAlign: "center" }}>
                {formatEur(data.jaarlijks.onderhoudBss)}
              </td>
            </tr>
            {isCharger && (
              <tr>
                <td>
                  Onderhoud DC-lader
                  {` — ${data.jaarlijks.laderType === "double" ? "Double" : "Single"} × ${data.jaarlijks.laderCount}`}
                </td>
                <td className="num" style={{ textAlign: "center" }}>
                  {formatEur(data.jaarlijks.onderhoudLader)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {data.notes ? (
          <div className="panel mt" style={{ marginTop: 20 }}>
            <b>Opmerkingen</b>
            <br />
            {data.notes}
          </div>
        ) : null}
      </section>

      {/* 12 — Ondertekening */}
      <section className="page">
        <Head s={s} pn={12} />
        <h2 className="sec-h">Ondertekening</h2>
        <p>
          Wij vertrouwen erop u een passende aanbieding te hebben gedaan. Wij danken u voor het
          vertrouwen en zien er naar uit om dit project succesvol voor u te realiseren.
        </p>
        <p>
          Hoogachtend,
          <br />
          {s.company.name}.<br />
          {s.company.contact}
        </p>
        <p className="mt">Voor opdrachtbevestiging vragen wij u dit document te ondertekenen en te paraferen.</p>
        <div className="signgrid">
          <div>
            Naam
            <div className="signline">{signature?.name}</div>
          </div>
          <div>
            Datum
            <div className="signline">{signature?.signedAt}</div>
          </div>
          <div>
            E-mail
            <div className="signline">{signature?.email}</div>
          </div>
          <div>
            Handtekening
            {signature?.signatureImgUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="signimg" src={signature.signatureImgUrl} alt="handtekening" />
            ) : (
              <div className="signline" />
            )}
          </div>
        </div>
        <div className="footco">
          <span>
            {s.company.name} · {s.company.address1} · {s.company.address2}
          </span>
          <span>
            IBAN {s.company.iban} · BTW {s.company.btwNr} · KVK {s.company.kvk} · {s.company.email}
          </span>
        </div>
      </section>
    </div>
  );
}

function WorkItem({
  title,
  text,
  amt,
  opt,
  partner,
}: {
  title: string;
  text: string;
  amt: string;
  opt?: string;
  partner: string;
}) {
  return (
    <div className="work">
      <div className="desc">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <div className="pricebox">
        <div className="amt">{amt}</div>
        {opt ? <div className="opt">{opt}</div> : null}
        <div style={{ marginTop: 6 }}>
          <span className="cb" />
          Uitvoering door {partner}
        </div>
        <div>
          <span className="cb" />
          Ik regel dit zelf
        </div>
      </div>
    </div>
  );
}

function GroupRow({ cols, children }: { cols: number; children: React.ReactNode }) {
  return (
    <tr className="grp">
      <td colSpan={cols + 2}>{children}</td>
    </tr>
  );
}

function RowShared({ label, cols, value }: { label: string; cols: number; value: string }) {
  return (
    <tr>
      <td>{label}</td>
      <td className="num"></td>
      <td className="num" colSpan={cols} style={{ textAlign: "center" }}>
        {value}
      </td>
    </tr>
  );
}

function RowPer({
  label,
  aantal,
  bs,
  render,
}: {
  label: string;
  aantal: string;
  bs: ProposalData["batteries"];
  render: (b: ProposalData["batteries"][number]) => string;
}) {
  return (
    <tr>
      <td>{label}</td>
      <td className="num">{aantal}</td>
      {bs.map((b, i) => (
        <td key={i} className="num" style={{ textAlign: "center" }}>
          {render(b)}
        </td>
      ))}
    </tr>
  );
}

// re-export for callers that want kWh parsing near the doc
export { parseKwh };
