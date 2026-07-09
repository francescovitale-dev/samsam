import { Resend } from "resend";

const from = process.env.EMAIL_FROM || "SamSam <offertes@samsam.nu>";

/**
 * Send an email via Resend. In dev (no RESEND_API_KEY) this logs to the
 * server console instead of sending, so the flow works fully offline.
 * Returns true if actually sent.
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log("\n────────────── ✉️  EMAIL (dev, not sent) ──────────────");
    console.log(`To:      ${opts.to}`);
    console.log(`Subject: ${opts.subject}`);
    if (opts.text) console.log(`\n${opts.text}`);
    console.log("──────────────────────────────────────────────────────\n");
    return false;
  }
  const resend = new Resend(key);
  await resend.emails.send({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
  return true;
}
