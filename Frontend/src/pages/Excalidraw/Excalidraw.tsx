import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Shape } from "./types";

import Toolbar from "./components/Toolbar";

import { useWebSocket } from "./hooks/useWebSocket";
import { useQuery } from "./hooks/useQuery";

import { drawShapes, getCanvasCoordinates } from "./utils/canvasUtils";

const Excalidraw: React.FC = () => {
  const COLORS = [
    "#1e1e1e", 
    "#d83931", 
    "#4a90e2", 
    "#5ba55b", 
    "#e2931d", 
    "#9d5bb5", 
    "#e6947a", 
    "#FFFFFF", 
  ];

  const LINE_WIDTHS = [1, 2, 3, 5, 8];

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentColor, setCurrentColor] = useState(COLORS[7]);
  const [currentLineWidth, setCurrentLineWidth] = useState(LINE_WIDTHS[1]);
  const [currentShape, setCurrentShape] = useState<string>("rect");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const query = useQuery();
  const username = query.get("username") || "Anonymous";

  const { 
    isConnected, 
    shapes, 
    sendShape, 
    clearCanvas, 
    connectionError
  } = useWebSocket(
    roomId || "default",
    username
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasDimensions = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const { width, height } = parent.getBoundingClientRect();
      
      canvas.width = width;
      canvas.height = height;
      
      drawShapes(ctx, shapes);
    };

    setCanvasDimensions();

    window.addEventListener("resize", setCanvasDimensions);

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawShapes(ctx, shapes);
  }, [shapes]);

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isConnected) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const coords = getCanvasCoordinates(e, canvas);
    setStartPoint(coords);
    setIsDrawing(true);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || !isConnected) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawShapes(ctx, shapes);

    const coords = getCanvasCoordinates(e, canvas);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentLineWidth;

    const width = coords.x - startPoint.x;
    const height = coords.y - startPoint.y;

    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    if (currentShape === "rect") {
      const radius = Math.min(
        5,
        Math.min(Math.abs(width), Math.abs(height)) / 5
      );

      ctx.beginPath();
      if (width >= 0 && height >= 0) {
        ctx.moveTo(startPoint.x + radius, startPoint.y);
        ctx.arcTo(
          startPoint.x + width,
          startPoint.y,
          startPoint.x + width,
          startPoint.y + height,
          radius
        );
        ctx.arcTo(
          startPoint.x + width,
          startPoint.y + height,
          startPoint.x,
          startPoint.y + height,
          radius
        );
        ctx.arcTo(
          startPoint.x,
          startPoint.y + height,
          startPoint.x,
          startPoint.y,
          radius
        );
        ctx.arcTo(
          startPoint.x,
          startPoint.y,
          startPoint.x + width,
          startPoint.y,
          radius
        );
      } else if (width < 0 && height >= 0) {
        ctx.moveTo(startPoint.x - radius, startPoint.y);
        ctx.arcTo(
          startPoint.x + width,
          startPoint.y,
          startPoint.x + width,
          startPoint.y + height,
          radius
        );
        ctx.arcTo(
          startPoint.x + width,
          startPoint.y + height,
          startPoint.x,
          startPoint.y + height,
          radius
        );
        ctx.arcTo(
          startPoint.x,
          startPoint.y + height,
          startPoint.x,
          startPoint.y,
          radius
        );
        ctx.arcTo(
          startPoint.x,
          startPoint.y,
          startPoint.x + width,
          startPoint.y,
          radius
        );
      } else if (width >= 0 && height < 0) {
        ctx.moveTo(startPoint.x + radius, startPoint.y);
        ctx.arcTo(
          startPoint.x + width,
          startPoint.y,
          startPoint.x + width,
          startPoint.y + height,
          radius
        );
        ctx.arcTo(
          startPoint.x + width,
          startPoint.y + height,
          startPoint.x,
          startPoint.y + height,
          radius
        );
        ctx.arcTo(
          startPoint.x,
          startPoint.y + height,
          startPoint.x,
          startPoint.y,
          radius
        );
        ctx.arcTo(
          startPoint.x,
          startPoint.y,
          startPoint.x + width,
          startPoint.y,
          radius
        );
      } else {
        ctx.moveTo(startPoint.x - radius, startPoint.y);
        ctx.arcTo(
          startPoint.x + width,
          startPoint.y,
          startPoint.x + width,
          startPoint.y + height,
          radius
        );
        ctx.arcTo(
          startPoint.x + width,
          startPoint.y + height,
          startPoint.x,
          startPoint.y + height,
          radius
        );
        ctx.arcTo(
          startPoint.x,
          startPoint.y + height,
          startPoint.x,
          startPoint.y,
          radius
        );
        ctx.arcTo(
          startPoint.x,
          startPoint.y,
          startPoint.x + width,
          startPoint.y,
          radius
        );
      }
      ctx.closePath();
      ctx.stroke();
    } else if (currentShape === "ellipse") {
      const centerX = startPoint.x + width / 2;
      const centerY = startPoint.y + height / 2;
      const radiusX = Math.abs(width) / 2;
      const radiusY = Math.abs(height) / 2;

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (currentShape === "triangle") {
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y + height);
      ctx.lineTo(startPoint.x + width / 2, startPoint.y);
      ctx.lineTo(startPoint.x + width, startPoint.y + height);
      ctx.closePath();
      ctx.stroke();
    }

    ctx.restore();
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || !isConnected) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const coords = getCanvasCoordinates(e, canvas);
    const width = coords.x - startPoint.x;
    const height = coords.y - startPoint.y;

    if (Math.abs(width) > 2 || Math.abs(height) > 2) {
      const newShape: Shape = {
        type: currentShape,
        x: startPoint.x,
        y: startPoint.y,
        width,
        height,
        color: currentColor,
        lineWidth: currentLineWidth,
      };

      sendShape(newShape);
    }

    setIsDrawing(false);
    setStartPoint(null);
  };

  const handleLeaveRoom = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      <Toolbar
        roomId={roomId}
        isConnected={isConnected}
        colors={COLORS}
        currentColor={currentColor}
        setCurrentColor={setCurrentColor}
        lineWidths={LINE_WIDTHS}
        currentLineWidth={currentLineWidth}
        setCurrentLineWidth={setCurrentLineWidth}
        currentShape={currentShape}
        setCurrentShape={setCurrentShape}
        clearCanvas={clearCanvas}
        handleLeaveRoom={handleLeaveRoom}
      />
      <div
        className="flex-grow relative overflow-hidden"
        ref={containerRef}
        style={{
          background: `linear-gradient(45deg, #ff416c, #ff4b2b)`,
          backgroundSize: `100% 100%`
        }}
      >
        {connectionError && (
          <div className="absolute top-0 inset-x-0 z-50 bg-red-800/80 border-b border-red-700 text-red-200 px-4 py-3 text-center">
            <p className="font-medium">{connectionError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Refresh Page
            </button>
          </div>
        )}

        {!isConnected && !connectionError && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#150b30]/95">
            <div className="bg-gradient-to-br from-[#2a1d5a] to-[#231245] px-8 py-6 rounded-lg shadow-md max-w-md border border-[#6a5bcd]/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-semibold text-white">Connecting to server...</h3>
              </div>
              <p className="text-gray-300 mb-4">Please wait while we establish a connection to the drawing server.</p>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        />
        
        {isConnected && (
          <div className="absolute bottom-4 left-4 text-sm text-white bg-black/80 px-3 py-1.5 rounded-md shadow-md border border-gray-700">
            Room: {roomId} · {username}
          </div>
        )}
      </div>
    </div>
  );
};

export default Excalidraw;
