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
        className={`flex items-center justify-between px-5 py-4 border-b border-zinc-800 ${
          collapsible ? "cursor-pointer select-none" : ""
        }`}
        onClick={collapsible ? () => setOpen((o) => !o) : undefined}
      >
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
              {title}
            </h3>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {collapsible && (
          <div className="text-zinc-500">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        )}
      </div>
      {(!collapsible || open) && (
        <div className="p-5">{children}</div>
      )}
    </div>
  );
}
