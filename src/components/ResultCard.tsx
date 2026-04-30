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
  gold: "border-yellow-600/40",
  green: "border-green-600/40",
  red: "border-red-600/40",
  blue: "border-blue-600/40",
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
    <div className={`rounded-2xl border ${borderMap[color]} bg-zinc-900 p-8`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-base font-semibold text-zinc-400 leading-snug">{title}</p>
        {info && (
          <button
            onClick={() => setInfoOpen((o) => !o)}
            className="text-zinc-500 hover:text-yellow-400 transition-colors flex-shrink-0 mt-0.5"
            title="How is this calculated?"
          >
            <Info size={20} />
          </button>
        )}
      </div>
      <p className={`font-bold ${large ? "text-5xl" : "text-4xl"} ${colorMap[color]} leading-none`}>
        {value}
      </p>
      {subtitle && <p className="text-base text-zinc-400 mt-2">{subtitle}</p>}

      {info && infoOpen && (
        <div className="mt-5 pt-5 border-t border-zinc-800 space-y-3">
          <p className="text-base text-zinc-400 leading-relaxed">{info.description}</p>
          {info.formula && (
            <div className="bg-zinc-800 rounded-xl p-4">
              <p className="text-base font-mono text-zinc-300">{info.formula}</p>
            </div>
          )}
          {info.inputs && info.inputs.length > 0 && (
            <ul className="space-y-1.5">
              {info.inputs.map((inp, i) => (
                <li key={i} className="text-base text-zinc-400">• {inp}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {children && (
        <div className="mt-4">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-2 text-base text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {expanded ? "Hide detail" : "Show detail"}
          </button>
          {expanded && (
            <div className="mt-4 pt-4 border-t border-zinc-800">{children}</div>
          )}
        </div>
      )}
    </div>
  );
}
