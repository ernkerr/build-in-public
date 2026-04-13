"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  StickyNote,
  FileEdit,
  Send,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/drafts", label: "Drafts", icon: FileEdit },
  { href: "/publish", label: "Publish", icon: Send },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function Nav() {
  return (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-6 px-2">
        <h1 className="text-lg font-bold tracking-tight">build-in-public</h1>
        <p className="text-xs text-muted-foreground">
          commits &rarr; content
        </p>
      </div>
      <NavLinks />
    </nav>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
        <h1 className="text-lg font-bold tracking-tight">build-in-public</h1>
        <button onClick={() => setOpen(true)} className="text-muted-foreground">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border p-4 md:hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-lg font-bold tracking-tight">build-in-public</h1>
                <p className="text-xs text-muted-foreground">commits &rarr; content</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
