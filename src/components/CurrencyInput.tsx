import React, { useState, useEffect } from "react";
import { parseMoney, formatCurrency } from "../lib/formatters";

interface CurrencyInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export function CurrencyInput({ value, onChange, placeholder = "$0", className = "" }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      const num = parseMoney(value);
      setDisplayValue(num ? formatCurrency(num) : "");
    }
  }, [value, focused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);
    const digits = raw.replace(/[^0-9.]/g, "");
    onChange(digits);
  };

  const handleFocus = () => {
    setFocused(true);
    const num = parseMoney(value);
    setDisplayValue(num ? String(num) : "");
  };

  const handleBlur = () => {
    setFocused(false);
    const num = parseMoney(value);
    setDisplayValue(num ? formatCurrency(num) : "");
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={`w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-colors ${className}`}
    />
  );
}
