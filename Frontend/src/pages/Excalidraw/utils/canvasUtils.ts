import { Shape } from "../types";

export const drawShapes = (
  ctx: CanvasRenderingContext2D,
  shapes: Shape[]
) => {
  ctx.fillStyle = "#120525";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawDots(ctx);

  shapes.forEach((shape) => {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.lineWidth;

    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    if (shape.type === "rect") {
      const radius = Math.min(
        5,
        Math.min(Math.abs(shape.width), Math.abs(shape.height)) / 5
      );

      ctx.beginPath();

      let x = shape.x;
      let y = shape.y;
      let width = shape.width;
      let height = shape.height;

      if (width < 0) {
        x = x + width;
        width = Math.abs(width);
      }

      if (height < 0) {
        y = y + height;
        height = Math.abs(height);
      }

      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.arcTo(x + width, y, x + width, y + radius, radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
      ctx.lineTo(x + radius, y + height);
      ctx.arcTo(x, y + height, x, y + height - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.closePath();

      ctx.stroke();
    } else if (shape.type === "arrow") {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      
      const angle = Math.atan2(shape.height, shape.width);
      
      const length = Math.sqrt(shape.width * shape.width + shape.height * shape.height);
      
      const arrowHeadLength = Math.min(15, length / 3);
      
      ctx.moveTo(shape.x, shape.y);
      ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
      
      const x2 = shape.x + shape.width;
      const y2 = shape.y + shape.height;
      
      ctx.lineTo(
        x2 - arrowHeadLength * Math.cos(angle - Math.PI / 6),
        y2 - arrowHeadLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - arrowHeadLength * Math.cos(angle + Math.PI / 6),
        y2 - arrowHeadLength * Math.sin(angle + Math.PI / 6)
      );
      
      ctx.stroke();
    } else if (shape.type === "circle") {
      ctx.beginPath();
      
      const centerX = shape.x + shape.width / 2;
      const centerY = shape.y + shape.height / 2;
      const radiusX = Math.abs(shape.width) / 2;
      const radiusY = Math.abs(shape.height) / 2;
      
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (shape.type === "triangle") {
      ctx.beginPath();
      
      let x = shape.x;
      let y = shape.y;
      let width = shape.width;
      let height = shape.height;
      
      if (width < 0) {
        x = x + width;
        width = Math.abs(width);
      }
      
      if (height < 0) {
        y = y + height;
        height = Math.abs(height);
      }
      
      ctx.moveTo(x + width / 2, y);
      ctx.lineTo(x, y + height);
      ctx.lineTo(x + width, y + height);
      ctx.closePath();
      
      ctx.stroke();
    }

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  });
};

export const drawDots = (ctx: CanvasRenderingContext2D) => {
  const gridSize = 30;
  const smallDotSize = 1;
  const largeDotSize = 2;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
  for (let x = gridSize; x < width; x += gridSize) {
    for (let y = gridSize; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.arc(x, y, smallDotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  const largeGridSize = gridSize * 5;
  for (let x = largeGridSize; x < width; x += largeGridSize) {
    for (let y = largeGridSize; y < height; y += largeGridSize) {
      ctx.beginPath();
      ctx.arc(x, y, largeDotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

export const getCanvasCoordinates = (
  e: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
): { x: number; y: number } => {
  if (!canvas) return { x: 0, y: 0 };

  const rect = canvas.getBoundingClientRect();
  
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
};
