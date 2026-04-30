import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

interface ResultCardProps {
  title: string;
  value: string;
  subtitle?: string;
  color?: "gold" | "green" | "red" | "blue" | "neutral";
  info?: {
    description: string;
    formula?: string;
    inputs?: string[];
  };
  children?: React.ReactNode;
  large?: boolean;
}

const colorMap = {
  gold: "text-yellow-400",
  green: "text-green-400",
  red: "text-red-400",
  blue: "text-blue-400",
  neutral: "text-zinc-100",
};

const borderMap = {
  gold: "border-yellow-600/30",
  green: "border-green-600/30",
  red: "border-red-600/30",
  blue: "border-blue-600/30",
  neutral: "border-zinc-700",
};

export function ResultCard({
  title,
  value,
  subtitle,
  color = "neutral",
  info,
  children,
  large = false,
}: ResultCardProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border ${borderMap[color]} bg-zinc-900 p-5`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{title}</p>
        {info && (
          <button
            onClick={() => setInfoOpen((o) => !o)}
            className="text-zinc-600 hover:text-yellow-500 transition-colors flex-shrink-0"
          >
            <Info size={14} />
          </button>
        )}
      </div>
      <p className={`font-bold ${large ? "text-3xl" : "text-2xl"} ${colorMap[color]}`}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}

      {info && infoOpen && (
        <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2">
          <p className="text-xs text-zinc-400">{info.description}</p>
          {info.formula && (
            <div className="bg-zinc-800 rounded p-2">
              <p className="text-xs font-mono text-zinc-300">{info.formula}</p>
            </div>
          )}
          {info.inputs && info.inputs.length > 0 && (
            <ul className="space-y-1">
              {info.inputs.map((inp, i) => (
                <li key={i} className="text-xs text-zinc-500">• {inp}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {children && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? "Hide detail" : "Show detail"}
          </button>
          {expanded && (
            <div className="mt-2 pt-2 border-t border-zinc-800">{children}</div>
          )}
        </div>
      )}
    </div>
  );
}
