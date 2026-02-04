import type { ProviderOption } from "@/lib/providers";

interface ProviderSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  options: ProviderOption[];
}

export function ProviderSelect({ value, onChange, disabled, options }: ProviderSelectProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      <label htmlFor="provider" className="text-sm font-medium text-slate-700">
        Provider
      </label>
      <select
        id="provider"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
