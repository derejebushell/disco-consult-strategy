import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  subtitle,
  children,
  collapsible = false,
  defaultOpen = true,
  badge,
  className = "",
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden ${className}`}>
      <div
        className={`flex items-center justify-between px-8 py-6 border-b border-zinc-800 ${
          collapsible ? "cursor-pointer select-none hover:bg-zinc-800/40 transition-colors" : ""
        }`}
        onClick={collapsible ? () => setOpen((o) => !o) : undefined}
      >
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-zinc-100">{title}</h3>
            {badge}
          </div>
          {subtitle && (
            <p className="text-base text-zinc-400 mt-1">{subtitle}</p>
          )}
        </div>
        {collapsible && (
          <div className="text-zinc-400 ml-4">
            {open ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        )}
      </div>
      {(!collapsible || open) && (
        <div className="p-8">{children}</div>
      )}
    </div>
  );
}
