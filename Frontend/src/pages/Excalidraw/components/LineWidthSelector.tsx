import React from "react";

interface LineWidthSelectorProps {
  lineWidths: number[];
  currentLineWidth: number;
  onChange: (width: number) => void;
}

const LineWidthSelector: React.FC<LineWidthSelectorProps> = ({
  lineWidths,
  currentLineWidth,
  onChange,
}) => (
  <div className="flex items-center">
    <span className="text-indigo-300 text-xs font-medium mr-2">Stroke</span>
    <div className="flex items-center gap-1">
      {lineWidths.map((width) => (
        <button
          key={width}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 ${
            width === currentLineWidth
              ? "bg-[#3a2875] shadow-sm border border-[#6a5bcd]/60"
              : "bg-[#261a52]/70 hover:bg-[#2e1f62] border border-transparent hover:border-[#6a5bcd]/40"
          }`}
          onClick={() => onChange(width)}
          title={`${width}px line width`}
        >
          <div
            className="bg-white rounded-full transition-transform duration-200 hover:scale-105"
            style={{
              width: Math.min(Math.max(width * 1.5, 4), 16),
              height: Math.min(Math.max(width * 1.5, 4), 16),
            }}
          />
        </button>
      ))}
    </div>
  </div>
);

export default LineWidthSelector;
