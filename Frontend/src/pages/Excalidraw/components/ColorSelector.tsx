import React from "react";

interface ColorSelectorProps {
  colors: string[];
  currentColor: string;
  onChange: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  currentColor,
  onChange,
}) => (
  <div className="flex items-center">
    <span className="text-indigo-300 text-xs font-medium mr-2">Colors</span>
    <div className="flex items-center gap-1">
      {colors.map((color) => (
        <button
          key={color}
          className={`w-6 h-6 rounded-md transition-all duration-200 hover:scale-105 ${
            currentColor === color
              ? "ring-2 ring-[#8a7aed] ring-offset-1 ring-offset-[#1a103c] shadow-sm"
              : ""
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          title={color}
        />
      ))}
    </div>
  </div>
);

export default ColorSelector;
