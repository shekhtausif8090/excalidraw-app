import { Request, Response } from "express";
import * as shapesRepository from "../repositories/shapesRepository";

export async function getShapes(req: Request, res: Response): Promise<void> {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      res.status(400).json({ error: "Room ID is required" });
      return;
    }

    console.log(`[shapesController] Getting shapes for room ${roomId}`);
    const shapes = await shapesRepository.getShapesForRoom(roomId);

    const shapesData = shapes.map((shape) => shape.data);

    console.log(
      `[shapesController] Found ${shapesData.length} shapes for room ${roomId}`
    );
    res.status(200).json(shapesData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[shapesController] Error fetching shapes: ${errorMessage}`);
    res
      .status(500)
      .json({ error: "Failed to fetch shapes", details: errorMessage });
  }
}

export async function updateShapes(req: Request, res: Response): Promise<void> {
  try {
    const { roomId } = req.params;
    const shapes = req.body;

    if (!roomId) {
      res.status(400).json({ error: "Room ID is required" });
      return;
    }

    if (!Array.isArray(shapes)) {
      console.error(
        `[shapesController] Invalid shapes data for room ${roomId}:`,
        shapes
      );
      res.status(400).json({ error: "Shapes must be an array" });
      return;
    }

    console.log(
      `[shapesController] Updating ${shapes.length} shapes for room ${roomId}`
    );

    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      if (!shape.type) {
        console.error(
          `[shapesController] Shape at index ${i} is missing 'type' property:`,
          shape
        );
        res
          .status(400)
          .json({ error: `Shape at index ${i} is missing 'type' property` });
        return;
      }

      if (
        typeof shape.x !== "number" ||
        typeof shape.y !== "number" ||
        typeof shape.width !== "number" ||
        typeof shape.height !== "number"
      ) {
        console.error(
          `[shapesController] Invalid shape at index ${i}:`,
          shape
        );
        res.status(400).json({
          error: `Invalid shape at index ${i}`,
          details:
            "All shapes must have x, y, width, and height properties as numbers",
        });
        return;
      }
    }

    await shapesRepository.updateShapesForRoom(roomId, shapes);

    console.log(
      `[shapesController] Successfully updated shapes for room ${roomId}`
    );
    res.status(200).json({ message: "Shapes updated successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[shapesController] Error updating shapes: ${errorMessage}`);
    res
      .status(500)
      .json({ error: "Failed to update shapes", details: errorMessage });
  }
}

export async function deleteShapes(req: Request, res: Response): Promise<void> {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      res.status(400).json({ error: "Room ID is required" });
      return;
    }

    console.log(`[shapesController] Deleting all shapes for room ${roomId}`);
    await shapesRepository.deleteShapesForRoom(roomId);

    console.log(
      `[shapesController] Successfully deleted shapes for room ${roomId}`
    );
    res.status(200).json({ message: "Shapes deleted successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[shapesController] Error deleting shapes: ${errorMessage}`);
    res
      .status(500)
      .json({ error: "Failed to delete shapes", details: errorMessage });
  }
}
