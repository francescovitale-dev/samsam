// Self-contained A4 document stylesheet, scoped under `.samsam-doc`.
// The SAME string is used for on-screen preview and the Chromium PDF route so
// they can never diverge. Brand colors are injected via CSS vars on the wrapper.
// Ported + modernized from the prototype's page CSS.

export function proposalCss(accent: string, teal: string): string {
  return `
.samsam-doc{
  --lime:${accent}; --teal:${teal}; --bar:#5f6570; --ink:#252a31; --grey:#6b7280;
  --panel:#f3f4f6; --border:#e5e7eb;
  color:var(--ink);
  font-family:'Inter',-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
}
.samsam-doc *{box-sizing:border-box;}
.samsam-doc .page{
  background:#fff; width:210mm; min-height:297mm; padding:18mm 16mm 22mm;
  position:relative; overflow:hidden; font-size:11.5px; line-height:1.5;
  margin:0 auto;
}
.samsam-doc .page + .page{ margin-top:18px; }

.samsam-doc .phead{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;}
.samsam-doc .phead .brandwrap{display:flex;align-items:center;gap:12px;}
.samsam-doc .phead img.logo{width:60px;height:60px;object-fit:contain;}
.samsam-doc .phead .hr{border-left:2px solid var(--ink);padding-left:12px;line-height:1.3;}
.samsam-doc .phead .hr b{font-size:15px;font-weight:700;display:block;}
.samsam-doc .phead .hr b.t{color:var(--lime);}
.samsam-doc .phead .hr .u{font-size:10.5px;color:var(--grey);}
.samsam-doc .pnum{position:absolute;right:8mm;bottom:14mm;color:var(--teal);font-size:10px;letter-spacing:1px;text-transform:uppercase;}

.samsam-doc .panel{background:var(--panel);border-radius:12px;padding:14px 18px;}
.samsam-doc .mt{margin-top:14px;}
.samsam-doc h2.sec-h{font-size:26px;font-weight:800;letter-spacing:-.02em;margin:4px 0 14px;line-height:1.1;}
.samsam-doc h3{font-size:14px;margin:0 0 5px;color:var(--ink);}
.samsam-doc p{margin:0 0 10px;}

.samsam-doc .barTitle{
  background:linear-gradient(90deg,var(--bar),#4b5560);color:#fff;border-radius:14px 14px 0 0;
  padding:16px 24px;font-size:26px;font-weight:800;text-align:center;letter-spacing:-.01em;
}
.samsam-doc .sideLabel{
  position:absolute;left:0;top:150px;background:var(--teal);color:#fff;writing-mode:vertical-rl;
  transform:rotate(180deg);padding:14px 7px;border-radius:0 8px 8px 0;font-weight:700;font-size:11px;letter-spacing:.5px;
}

/* cover */
.samsam-doc .cover{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;min-height:261mm;text-align:center;padding-top:46mm;}
.samsam-doc .cover img.big{width:104mm;height:104mm;object-fit:contain;}
.samsam-doc .cover .cust{font-size:26px;font-weight:800;font-style:italic;margin-top:20mm;}
.samsam-doc .cover .subject{font-size:14px;color:var(--grey);margin-top:6px;}
.samsam-doc .cover .zk{position:absolute;bottom:24mm;right:22mm;text-align:right;}
.samsam-doc .cover .zk .s{font-size:11px;color:#666;}
.samsam-doc .cover .zk .z{font-size:26px;font-weight:800;color:#4a4a4a;}
.samsam-doc .cover .zk .z b{color:var(--lime);}

/* letter */
.samsam-doc .metaTbl{width:100%;border-collapse:collapse;}
.samsam-doc .metaTbl td{padding:3px 0;vertical-align:top;font-size:12px;}
.samsam-doc .metaTbl td:first-child{width:150px;color:#555;}
.samsam-doc .metaTbl .mail{color:var(--teal);}

.samsam-doc .three-ico{display:grid;grid-template-columns:1fr;gap:14px;margin-top:10px;}
.samsam-doc .three-ico .it{display:flex;gap:12px;}
.samsam-doc .three-ico .it .dot{flex:0 0 auto;width:10px;height:10px;border-radius:50%;background:var(--lime);margin-top:5px;}
.samsam-doc .three-ico .it b{color:var(--teal);}
.samsam-doc .sidebox{background:var(--teal);color:#fff;border-radius:12px;padding:16px 18px;font-size:12px;margin-top:16px;}

/* battery comparison */
.samsam-doc .cmp{width:100%;border-collapse:collapse;background:var(--panel);border-radius:12px;overflow:hidden;}
.samsam-doc .cmp th,.samsam-doc .cmp td{padding:6px 8px;font-size:11px;text-align:center;}
.samsam-doc .cmp td.lbl,.samsam-doc .cmp th.lbl{text-align:left;font-weight:500;color:#444;}
.samsam-doc .cmp tr{border-bottom:1px solid #e2e5ea;}
.samsam-doc .cmp .merk td{font-weight:800;font-size:13px;padding-top:10px;color:var(--ink);}
.samsam-doc .cmp .photos td{padding:8px 0;background:#fff;}
.samsam-doc .cmp .photos img{height:104px;object-fit:contain;}
.samsam-doc .stars{color:var(--lime);letter-spacing:2px;font-size:15px;}
.samsam-doc .prijsbar{
  background:linear-gradient(90deg,var(--bar),#4b5560);color:#fff;display:grid;border-radius:0 0 12px 12px;margin-top:2px;
}
.samsam-doc .prijsbar div{padding:14px 8px;text-align:center;font-weight:800;font-size:15px;}
.samsam-doc .prijsbar .pl{text-align:left;font-weight:600;}

/* work items */
.samsam-doc .work{display:grid;grid-template-columns:1fr 160px;gap:16px;margin-top:16px;align-items:start;}
.samsam-doc .pricebox{background:var(--panel);border-radius:12px;padding:12px 14px;font-size:11px;text-align:center;}
.samsam-doc .pricebox .amt{font-size:17px;font-weight:800;margin-bottom:4px;color:var(--teal);}
.samsam-doc .pricebox .opt{color:#555;margin-top:4px;}
.samsam-doc .pricebox .cb{display:inline-block;width:11px;height:11px;border:1px solid #999;border-radius:3px;vertical-align:middle;margin-right:5px;}

/* investering */
.samsam-doc .inv{width:100%;border-collapse:collapse;}
.samsam-doc .inv td,.samsam-doc .inv th{padding:6px 8px;font-size:11.5px;border-bottom:1px solid #eceef1;}
.samsam-doc .inv th{font-weight:700;}
.samsam-doc .inv .num{text-align:right;white-space:nowrap;}
.samsam-doc .inv .grp td{font-weight:700;padding-top:10px;border-bottom:0;color:var(--teal);}
.samsam-doc .inv .tot td{font-weight:800;border-top:2px solid var(--ink);border-bottom:0;font-size:13px;padding-top:9px;}
.samsam-doc .inv .merkrow td{text-align:center;font-weight:800;background:var(--panel);}
.samsam-doc .keuze{display:inline-block;width:15px;height:15px;border:1.5px solid var(--teal);border-radius:4px;}

/* signature */
.samsam-doc .signgrid{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:22px;}
.samsam-doc .signline{border-bottom:1.5px solid #9aa0a6;height:30px;margin-top:12px;}
.samsam-doc .signimg{max-height:60px;margin-top:8px;}
.samsam-doc .footco{position:absolute;left:16mm;right:16mm;bottom:12mm;display:flex;justify-content:space-between;gap:12px;font-size:10px;color:#666;border-top:1px solid var(--border);padding-top:8px;}

@media print{
  .samsam-doc .page{box-shadow:none !important;margin:0 !important;page-break-after:always;}
  .samsam-doc .page:last-child{page-break-after:auto;}
  .samsam-doc .page + .page{margin-top:0;}
}
`;
}
