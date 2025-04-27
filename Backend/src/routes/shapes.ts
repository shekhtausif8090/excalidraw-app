import express from "express";
import * as shapesController from "../controllers/shapesController";

const router = express.Router();

router.get("/:roomId", shapesController.getShapes);

router.post("/:roomId", shapesController.updateShapes);

router.delete("/:roomId", shapesController.deleteShapes);

export default router;
