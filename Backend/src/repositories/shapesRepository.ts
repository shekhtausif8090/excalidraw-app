import { PrismaClient } from "@prisma/client";
import prisma from "../services/prisma";

export type ShapeData = {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  lineWidth: number;
};

export interface Shape {
  id: string;
  roomId: string;
  type: string;
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShapeWithData extends Omit<Shape, "data"> {
  data: ShapeData;
}

function validateShapeData(shape: any): boolean {
  if (!shape || typeof shape !== "object") return false;

  if (!shape.type) return false;

  return (
    typeof shape.x === "number" &&
    typeof shape.y === "number" &&
    typeof shape.width === "number" &&
    typeof shape.height === "number" &&
    typeof shape.color === "string" &&
    typeof shape.lineWidth === "number"
  );
}

export async function ensureRoomExists(roomId: string): Promise<void> {
  try {
    console.log(`[shapesRepository] Ensuring room exists: ${roomId}`);
    
    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!existingRoom) {
      console.log(`[shapesRepository] Creating new room: ${roomId}`);
      await prisma.room.create({
        data: {
          id: roomId
        }
      });
    }
    
    console.log(`[shapesRepository] Room ${roomId} exists`);
  } catch (error) {
    console.error(`[shapesRepository] Error ensuring room exists: ${error}`);
    throw error;
  }
}

export async function getShapesForRoom(
  roomId: string
): Promise<ShapeWithData[]> {
  try {
    console.log(`[shapesRepository] Getting shapes for room: ${roomId}`);
    await ensureRoomExists(roomId);

    const shapes = await prisma.shape.findMany({
      where: { roomId },
    });

    console.log(
      `[shapesRepository] Found ${shapes.length} shapes for room ${roomId}`
    );

    return shapes.map((shape: Shape) => {
      if (!validateShapeData(shape.data)) {
        console.warn(
          `[shapesRepository] Invalid shape data found for shape ID ${shape.id}, using fallback`
        );
        const fallbackData: ShapeData = {
          type: "rect",
          x: 0,
          y: 0,
          width: 10,
          height: 10,
          color: "black",
          lineWidth: 1,
        };

        return {
          ...shape,
          data: fallbackData,
        };
      }

      return {
        ...shape,
        data: shape.data as ShapeData,
      };
    });
  } catch (error) {
    console.error(
      `[shapesRepository] Error getting shapes for room ${roomId}: ${error}`
    );
    throw error;
  }
}

export async function updateShapesForRoom(
  roomId: string,
  shapes: ShapeData[]
): Promise<void> {
  try {
    console.log(
      `[shapesRepository] Updating ${shapes.length} shapes for room ${roomId}`
    );
    await ensureRoomExists(roomId);

    const validShapes = shapes.filter((shape) => validateShapeData(shape));

    if (validShapes.length !== shapes.length) {
      console.warn(
        `[shapesRepository] Filtered out ${
          shapes.length - validShapes.length
        } invalid shapes`
      );
    }

    await prisma.$transaction(async (tx) => {
      console.log(
        `[shapesRepository] Deleting existing shapes for room ${roomId}`
      );
      await tx.shape.deleteMany({
        where: { roomId },
      });

      if (validShapes.length > 0) {
        console.log(
          `[shapesRepository] Creating ${validShapes.length} new shapes for room ${roomId}`
        );
        await tx.shape.createMany({
          data: validShapes.map((shapeData) => ({
            roomId,
            type: shapeData.type,
            data: shapeData as any,
          })),
        });
      }
    });

    console.log(
      `[shapesRepository] Successfully updated shapes for room ${roomId}`
    );
  } catch (error) {
    console.error(
      `[shapesRepository] Error updating shapes for room ${roomId}: ${error}`
    );
    throw error;
  }
}

export async function deleteShapesForRoom(roomId: string): Promise<void> {
  try {
    console.log(`[shapesRepository] Deleting all shapes for room ${roomId}`);
    await prisma.shape.deleteMany({
      where: { roomId },
    });
    console.log(
      `[shapesRepository] Successfully deleted all shapes for room ${roomId}`
    );
  } catch (error) {
    console.error(
      `[shapesRepository] Error deleting shapes for room ${roomId}: ${error}`
    );
    throw error;
  }
}
