import React from "react";
import ShapeSelector from "./ShapeSelector";
import ColorSelector from "./ColorSelector";
import LineWidthSelector from "./LineWidthSelector";

interface ToolbarProps {
  roomId?: string;
  isConnected?: boolean;
  colors: string[];
  currentColor: string;
  setCurrentColor: (color: string) => void;
  lineWidths: number[];
  currentLineWidth: number;
  setCurrentLineWidth: (width: number) => void;
  currentShape: string;
  setCurrentShape: (shape: string) => void;
  clearCanvas: () => void;
  handleLeaveRoom: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  colors,
  currentColor,
  setCurrentColor,
  lineWidths,
  currentLineWidth,
  setCurrentLineWidth,
  currentShape,
  setCurrentShape,
  clearCanvas,
  handleLeaveRoom,
}) => (
  <div className="p-2.5 bg-gradient-to-r from-[#1c1338] to-[#2a1d5a] border-b border-[#6a5bcd]/40 shadow-md">

    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center space-x-4 flex-wrap gap-y-2">
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-indigo-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
          <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            Canvas Flow
          </span>
        </div>

        <div className="h-6 w-px bg-[#6a5bcd]/30" />

        <ShapeSelector currentShape={currentShape} onChange={setCurrentShape} />

        <div className="h-6 w-px bg-[#6a5bcd]/30" />

        <ColorSelector
          colors={colors}
          currentColor={currentColor}
          onChange={setCurrentColor}
        />

        <div className="h-6 w-px bg-[#6a5bcd]/30" />

        <LineWidthSelector
          lineWidths={lineWidths}
          currentLineWidth={currentLineWidth}
          onChange={setCurrentLineWidth}
        />
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={clearCanvas}
          className="px-3 py-1.5 bg-[#2e1f62] hover:bg-[#3a2875] rounded-md text-sm font-medium text-white transition-colors duration-200 flex items-center space-x-1 border border-[#6a5bcd]/40"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Clear Canvas</span>
        </button>

        <button
          onClick={handleLeaveRoom}
          className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 border border-red-800/50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Leave Room</span>
        </button>
      </div>
    </div>
  </div>
);

export default Toolbar;
