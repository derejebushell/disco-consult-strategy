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
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-base font-semibold text-zinc-200">
        {label}
        {required && <span className="text-amber-400 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-sm text-zinc-500">{hint}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-colors ${className}`}
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
      className={`w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-lg text-zinc-100 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-colors appearance-none cursor-pointer ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" className="text-zinc-500 bg-zinc-800">
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-zinc-800">
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
      className={`w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-colors resize-none leading-relaxed ${className}`}
      {...props}
    />
  );
}
