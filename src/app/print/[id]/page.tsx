import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { toDocSettings } from "@/lib/proposal/doc-settings";
import { ProposalDocument, type SignatureData } from "@/components/proposal/proposal-document";
import type { ProposalData } from "@/lib/proposal/types";

export const dynamic = "force-dynamic";

/**
 * Bare, token-gated render of the full-size proposal document.
 * Used as the print source for the Chromium PDF route and reusable elsewhere.
 * Guarded by the proposal's unguessable publicToken (no login required so the
 * headless browser can fetch it).
 */
export default async function PrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;
  const proposal = await prisma.proposal.findUnique({ where: { id } });
  if (!proposal || !token || proposal.publicToken !== token) notFound();

  const settings = await getSettings();
  const data = proposal.data as unknown as ProposalData;
  const signature = (proposal.signature as unknown as SignatureData | null) ?? null;

  return (
    <>
      <style>{`html,body{background:#fff;margin:0;padding:0;}`}</style>
      <ProposalDocument data={data} settings={toDocSettings(settings)} signature={signature} />
    </>
  );
}
