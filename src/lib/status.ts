export type ProposalStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "signed"
  | "accepted"
  | "rejected"
  | "expired";

export const STATUS_LABELS: Record<ProposalStatus, string> = {
  draft: "Concept",
  sent: "Verzonden",
  viewed: "Bekeken",
  signed: "Getekend",
  accepted: "Geaccepteerd",
  rejected: "Afgewezen",
  expired: "Verlopen",
};

/** Tailwind classes for the status chip. */
export const STATUS_CLASSES: Record<ProposalStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-100 text-blue-700",
  viewed: "bg-amber-100 text-amber-800",
  signed: "bg-emerald-100 text-emerald-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-zinc-200 text-zinc-600",
};

export function statusLabel(s: string): string {
  return STATUS_LABELS[s as ProposalStatus] ?? s;
}
export function statusClass(s: string): string {
  return STATUS_CLASSES[s as ProposalStatus] ?? "bg-muted text-muted-foreground";
}
