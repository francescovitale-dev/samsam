import { NextRequest } from "next/server";
import { isAuthed } from "@/lib/gate";
import { prisma } from "@/lib/prisma";
import { renderUrlToPdf } from "@/lib/pdf";
import { put } from "@vercel/blob";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return new Response("Unauthorized", { status: 401 });

  const { id } = await ctx.params;
  const proposal = await prisma.proposal.findUnique({ where: { id } });
  if (!proposal) return new Response("Not found", { status: 404 });

  const origin = new URL(req.url).origin;
  const printUrl = `${origin}/print/${id}?token=${proposal.publicToken}`;
  const pdf = await renderUrlToPdf(printUrl);
  const filename = `Offerte-${proposal.number}.pdf`;

  // Best-effort: persist to Blob + record event (only when a token is configured).
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`proposals/${proposal.number}.pdf`, pdf, {
        access: "public",
        contentType: "application/pdf",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      await prisma.proposal.update({ where: { id }, data: { pdfUrl: blob.url } });
    } catch {
      /* non-fatal */
    }
  }
  await prisma.proposalEvent.create({ data: { proposalId: id, type: "downloaded" } });

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
