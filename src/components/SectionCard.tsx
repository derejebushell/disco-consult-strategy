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
    <div
      className={`rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden ${className}`}
    >
      <div
        className={`flex items-center justify-between px-6 py-5 border-b border-zinc-800 ${
          collapsible ? "cursor-pointer select-none hover:bg-zinc-800/40 transition-colors" : ""
        }`}
        onClick={collapsible ? () => setOpen((o) => !o) : undefined}
      >
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-zinc-100">
              {title}
            </h3>
            {badge}
          </div>
          {subtitle && (
            <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {collapsible && (
          <div className="text-zinc-400">
            {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        )}
      </div>
      {(!collapsible || open) && (
        <div className="p-6">{children}</div>
      )}
    </div>
  );
}
