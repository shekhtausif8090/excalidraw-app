import { useState, useEffect, useCallback } from "react";
import { Shape } from "../types";

const WS_URL = process.env.NODE_ENV === 'production' 
  ? `${window.location.protocol.replace('http', 'ws')}//${window.location.host}` 
  : `ws://localhost:8080`;

interface UseWebSocketResult {
  isConnected: boolean;
  shapes: Shape[];
  sendShape: (shape: Shape) => void;
  clearCanvas: () => void;
  connectionError: string | null;
}

export function useWebSocket(
  roomId: string,
  username: string
): UseWebSocketResult {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout>;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAY = 3000;
    
    const connectWebSocket = () => {
      try {
        const wsUrl = `${WS_URL}`;
        console.log(`Connecting to WebSocket at ${wsUrl}`);
        
        const ws = new WebSocket(wsUrl);
        setConnectionError(null);
        
        ws.onopen = () => {
          console.log("WebSocket connected");
          setIsConnected(true);
          reconnectAttempts = 0;
          
          ws.send(
            JSON.stringify({
              type: "join_room",
              payload: { roomId, username },
            })
          );
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            switch(message.type) {
              case "initial_shapes":
                setShapes(message.payload.shapes);
                break;
                
              case "update_shapes":
                setShapes(message.payload.shapes);
                break;
                
              case "error":
                console.error("Error from server:", message.payload.message);
                setConnectionError(message.payload.message);
                break;
                
              default:
                console.log("Unhandled message type:", message.type);
            }
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };

        ws.onclose = (event) => {
          console.log(`WebSocket disconnected, code: ${event.code}, reason: ${event.reason}`);
          setIsConnected(false);
          
          if (!event.wasClean && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            setConnectionError(`Connection lost. Attempting to reconnect (${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})...`);
            reconnectTimer = setTimeout(() => {
              reconnectAttempts++;
              connectWebSocket();
            }, RECONNECT_DELAY);
          } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            setConnectionError("Failed to connect after multiple attempts. Please refresh the page.");
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setConnectionError("Connection error. Please check your network.");
        };

        setSocket(ws);
      } catch (error) {
        console.error("Error creating WebSocket:", error);
        setConnectionError("Failed to establish connection. Please refresh the page.");
      }
    };
    
    connectWebSocket();

    return () => {
      if (socket) {
        socket.close(1000, "Component unmounted");
      }
      clearTimeout(reconnectTimer);
    };
  }, [roomId, username]);

  const sendShape = useCallback((shape: Shape) => {
    if (socket && isConnected) {
      setShapes(prevShapes => [...prevShapes, shape]);
      
      socket.send(
        JSON.stringify({
          type: "draw_shape",
          payload: { shape },
        })
      );
    }
  }, [socket, isConnected]);

  const clearCanvas = useCallback(() => {
    if (socket && isConnected) {
      setShapes([]);
      
      socket.send(
        JSON.stringify({
          type: "clear_canvas",
        })
      );
    }
  }, [socket, isConnected]);

  return { 
    isConnected, 
    shapes, 
    sendShape, 
    clearCanvas, 
    connectionError
  };
}
