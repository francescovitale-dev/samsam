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
              "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              active
                ? "bg-brand-teal/10 text-brand-teal"
                : "text-muted-foreground hover:translate-x-0.5 hover:bg-muted hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-lime transition-all duration-300",
                active ? "opacity-100" : "opacity-0 group-hover:opacity-40",
              )}
            />
            <Icon className={cn("size-4 transition-transform duration-200", active && "scale-110")} />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
