import React from "react";

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function Field({ label, hint, children, required, className = "" }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
        {label}
        {required && <span className="text-amber-400 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-zinc-600">{hint}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600/30 transition-colors ${className}`}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ options, placeholder, className = "", ...props }: SelectProps) {
  return (
    <select
      className={`w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600/30 transition-colors appearance-none ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" className="text-zinc-600">
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      rows={3}
      className={`w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600/30 transition-colors resize-none ${className}`}
      {...props}
    />
  );
}
