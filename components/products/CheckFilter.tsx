"use client";

interface CheckFilterProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function CheckFilter({ label, checked, onChange }: CheckFilterProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group select-none">
      {/* Input oculto para accesibilidad */}
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />

      {/* Checkbox Visual */}
      <div
        className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center transition-all duration-300 ${
          checked
            ? "border-musgo bg-musgo"
            : "border-stone-200 group-hover:border-stone-400 bg-white"
        }`}
      >
        {checked && (
          <svg
            width="8"
            height="6"
            viewBox="0 0 8 6"
            fill="none"
            className="animate-in zoom-in duration-200"
          >
            <path
              d="M1 3l2 2 4-4"
              stroke="white"
              strokeWidth="2" // Un poco más grueso para que se vea mejor
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Texto del Label */}
      <span
        className={`font-sans text-xs transition-colors duration-300 ${
          checked
            ? "text-negro font-medium"
            : "text-stone-500 group-hover:text-stone-800"
        }`}
      >
        {label}
      </span>
    </label>
  );
}
