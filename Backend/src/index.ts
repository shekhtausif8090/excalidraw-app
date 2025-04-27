import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { generateClientId } from "./utils";
import cors from "cors";
import * as shapesRepository from "./repositories/shapesRepository";
import dotenv from "dotenv";
import compression from "compression";
import helmet from "helmet";

dotenv.config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || 'development';

interface WebSocketWithId extends WebSocket {
  clientId: string;
  roomId?: string;
  username?: string;
}

interface Shape {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  lineWidth: number;
}

const rooms = new Map<string, Set<WebSocketWithId>>();
const roomShapes = new Map<string, Shape[]>();

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors({
  origin: "https://excalidraw-app.netlify.app/",
  methods: ["GET", "POST"]
}));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Realtime Drawing Server is running." });
});

wss.on("connection", (ws: WebSocket) => {
  const clientId = generateClientId();
  const wsWithId = ws as WebSocketWithId;
  wsWithId.clientId = clientId;

  console.log(`Client connected: ${clientId}`);

  wsWithId.on("message", (message: Buffer) => {
    try {
      const parsedMessage = JSON.parse(message.toString());

      switch (parsedMessage.type) {
        case "join_room":
          handleJoinRoom(
            wsWithId,
            parsedMessage.payload.roomId,
            parsedMessage.payload.username
          );
          break;
        case "draw_shape":
          handleDrawShape(wsWithId, parsedMessage.payload.shape);
          break;
        case "clear_canvas":
          handleClearCanvas(wsWithId);
          break;
        default:
          sendError(wsWithId, "Unknown message type");
      }
    } catch (error) {
      console.error(`Failed to process message from ${clientId}:`, error);
      sendError(wsWithId, "Invalid message format.");
    }
  });

  wsWithId.on("close", () => {
    console.log(`Client disconnected: ${clientId}`);
    handleClientDisconnect(wsWithId);
  });

  wsWithId.on("error", (error) => {
    console.error(`WebSocket error for client ${clientId}:`, error);
  });
});

function sendError(ws: WebSocketWithId, message: string) {
  ws.send(
    JSON.stringify({
      type: "error",
      payload: { message },
    })
  );
}

function sendSuccess(ws: WebSocketWithId, message: string) {
  ws.send(
    JSON.stringify({
      type: "success",
      payload: { message },
    })
  );
}

async function handleJoinRoom(ws: WebSocketWithId, roomId: string, username: string) {
  ws.roomId = roomId;
  ws.username = username;

  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set<WebSocketWithId>());
    console.log(`Room created: ${roomId}`);
  }

  const room = rooms.get(roomId)!;
  room.add(ws);
  
  console.log(`Client ${ws.clientId} (${username}) joined room ${roomId}`);

  if (!roomShapes.has(roomId)) {
    try {
      const dbShapes = await shapesRepository.getShapesForRoom(roomId);
      const shapes = dbShapes.map(shape => shape.data);
      roomShapes.set(roomId, shapes);
      console.log(`Loaded ${shapes.length} shapes from database for room ${roomId}`);
    } catch (error) {
      console.error(`Error loading shapes from database for room ${roomId}:`, error);
      roomShapes.set(roomId, []);
    }
  }

  sendExistingShapesToUser(ws, roomId);
}

function sendExistingShapesToUser(ws: WebSocketWithId, roomId: string) {
  const shapes = roomShapes.get(roomId) || [];
  ws.send(
    JSON.stringify({
      type: "initial_shapes",
      payload: { shapes },
    })
  );
}

async function handleDrawShape(ws: WebSocketWithId, shape: Shape) {
  const roomId = ws.roomId;
  if (!roomId) {
    sendError(ws, "You are not in a room.");
    return;
  }

  const shapes = roomShapes.get(roomId) || [];
  shapes.push(shape);
  roomShapes.set(roomId, shapes);

  broadcastToRoom(roomId, {
    type: "update_shapes",
    payload: { shapes },
  });

  try {
    await shapesRepository.updateShapesForRoom(roomId, shapes);
  } catch (error) {
    console.error(`Error saving shapes to database for room ${roomId}:`, error);
  }
}

async function handleClearCanvas(ws: WebSocketWithId) {
  const roomId = ws.roomId;
  if (!roomId) {
    sendError(ws, "You are not in a room.");
    return;
  }

  roomShapes.set(roomId, []);

  broadcastToRoom(roomId, {
    type: "update_shapes",
    payload: { shapes: [] },
  });

  try {
    await shapesRepository.deleteShapesForRoom(roomId);
    console.log(`Cleared shapes in database for room ${roomId}`);
  } catch (error) {
    console.error(`Error clearing shapes in database for room ${roomId}:`, error);
  }
}

function handleClientDisconnect(ws: WebSocketWithId) {
  if (ws.roomId) {
    const room = rooms.get(ws.roomId);
    if (room) {
      room.delete(ws);
            
      if (room.size === 0) {
        rooms.delete(ws.roomId);
        roomShapes.delete(ws.roomId);
        console.log(`Room ${ws.roomId} removed from memory (no more clients)`);
      }
    }
  }
}

function broadcastToRoom(roomId: string, message: any) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: ENV === 'production' ? 'Internal Server Error' : err.message });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT} in ${ENV} mode`);
});
