interface CheckFilterProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function CheckFilter({ label, checked, onChange }: CheckFilterProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        onClick={onChange}
        className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center transition-all duration-200 ${
          checked
            ? "border-musgo bg-musgo"
            : "border-stone-300 group-hover:border-stone-400"
        }`}
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path
              d="M1 3l2 2 4-4"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="sans text-xs text-stone-600 group-hover:text-stone-900 transition-colors">
        {label}
      </span>
    </label>
  );
}
