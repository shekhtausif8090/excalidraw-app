import React from "react";

interface ShapeSelectorProps {
  currentShape: string;
  onChange: (shape: string) => void;
}

const ShapeSelector: React.FC<ShapeSelectorProps> = ({
  currentShape,
  onChange,
}) => (
  <div className="flex items-center">
    <span className="text-indigo-300 text-xs font-medium mr-2">Shapes</span>
    <div className="flex items-center gap-1">
      <button
        className={`p-1.5 rounded-md transition-all duration-200 ${
          currentShape === "rect"
            ? "bg-[#3a2875] text-white shadow-sm border border-[#6a5bcd]/60"
            : "bg-[#261a52]/70 text-gray-300 hover:bg-[#2e1f62] border border-transparent hover:border-[#6a5bcd]/40"
        }`}
        onClick={() => onChange("rect")}
        title="Rectangle"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
        </svg>
      </button>
      <button
        className={`p-1.5 rounded-md transition-all duration-200 ${
          currentShape === "arrow"
            ? "bg-[#3a2875] text-white shadow-sm border border-[#6a5bcd]/60"
            : "bg-[#261a52]/70 text-gray-300 hover:bg-[#2e1f62] border border-transparent hover:border-[#6a5bcd]/40"
        }`}
        onClick={() => onChange("arrow")}
        title="Arrow"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14" strokeWidth="2" strokeLinecap="round" />
          <path d="M15 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        className={`p-1.5 rounded-md transition-all duration-200 ${
          currentShape === "circle"
            ? "bg-[#3a2875] text-white shadow-sm border border-[#6a5bcd]/60"
            : "bg-[#261a52]/70 text-gray-300 hover:bg-[#2e1f62] border border-transparent hover:border-[#6a5bcd]/40"
        }`}
        onClick={() => onChange("circle")}
        title="Circle"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
        </svg>
      </button>
      <button
        className={`p-1.5 rounded-md transition-all duration-200 ${
          currentShape === "triangle"
            ? "bg-[#3a2875] text-white shadow-sm border border-[#6a5bcd]/60"
            : "bg-[#261a52]/70 text-gray-300 hover:bg-[#2e1f62] border border-transparent hover:border-[#6a5bcd]/40"
        }`}
        onClick={() => onChange("triangle")}
        title="Triangle"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 3 L3 21 L21 21 Z" strokeWidth="2" />
        </svg>
      </button>
    </div>
  </div>
);

export default ShapeSelector;
