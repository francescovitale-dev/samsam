"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Users, Settings, FileText } from "lucide-react";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/catalogus", label: "Catalogus", icon: Package },
  { href: "/klanten", label: "Klanten", icon: Users },
  { href: "/instellingen", label: "Instellingen", icon: Settings },
];

export function AppNav() {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="flex flex-col gap-1 p-3">
      <div className="mb-4 flex items-center gap-2 px-2 pt-2">
        <FileText className="size-5 text-brand-teal" />
        <div className="text-lg font-extrabold tracking-tight">
          Sam<span className="text-brand-lime">Sam</span>
        </div>
        <span className="text-xs text-muted-foreground">Offertes</span>
      </div>
      {items.map((it) => {
        const Icon = it.icon;
        const active = isActive(it.href, it.exact);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-brand-teal/10 text-brand-teal"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
