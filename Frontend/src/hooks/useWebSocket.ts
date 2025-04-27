// chat-app/client/src/hooks/useWebSocket.ts
import { useState, useEffect, useRef, useCallback } from "react";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || "wss://canvas-flow-backend.onrender.com";

const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

interface UseWebSocketOptions {
  roomId: string | null;
  username: string;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessageReceived: (message: any) => void; // Callback to update state
}

export function useWebSocket({
  roomId,
  username,
  onOpen,
  onClose,
  onError,
  onMessageReceived,
}: UseWebSocketOptions) {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const connectWebSocket = useCallback(() => {
    if (!roomId || !username) {
      console.log(
        "WebSocket: Room ID or Username not provided, skipping connection."
      );
      return;
    }
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket is already connected.");
      return;
    }
    const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || "wss://canvas-flow-backend.onrender.com";
    console.log("Attempting to connect to WebSocket URL:", WEBSOCKET_URL);
    console.log(
      `WebSocket: Attempting to connect to room ${roomId} as ${username}...`
    );
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = (event) => {
      console.log("WebSocket: Connection opened");
      setIsConnected(true);
      reconnectAttempts.current = 0;
      // Send join room message
      ws.current?.send(
        JSON.stringify({
          type: "join_room",
          payload: { roomId, username },
        })
      );
      onOpen?.(event);
    };

    ws.current.onclose = (event) => {
      console.log("WebSocket: Connection closed", event.reason);
      setIsConnected(false);
      ws.current = null; // Clean up ref
      onClose?.(event);
      // Attempt to reconnect unless we've hit the limit
      if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts.current += 1;
        console.log(
          `WebSocket: Reconnecting attempt ${reconnectAttempts.current}...`
        );
        reconnectTimeoutRef.current = setTimeout(
          connectWebSocket,
          RECONNECT_DELAY
        );
      } else {
        console.log("WebSocket: Max reconnection attempts reached");
      }
    };

    ws.current.onerror = (event) => {
      console.error("WebSocket: Error:", event);
      onError?.(event);
      ws.current?.close();
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("WebSocket: Message received:", message);

        // Handle drawing messages - could be raw data or wrapped in a chat message
        if (typeof message === "object") {
          // Case 1: Direct data handling for drawing messages
          if (Array.isArray(message)) {
            onMessageReceived({ content: JSON.stringify(message) });
            return;
          }

          // Case 2: Normal message format with type and payload
          switch (message.type) {
            case "chat_message":
            case "notify_user_joined":
            case "notify_user_left":
            case "error":
              // Check if the message contains drawing data
              if (message.payload.isDrawingData) {
                onMessageReceived({
                  content: message.payload.content,
                  isDrawingData: true,
                  sender: message.payload.sender,
                  timestamp: message.payload.timestamp,
                });
                return;
              }

              // Regular message handling
              onMessageReceived(message.payload);
              break;
            case "room_created":
              console.log(`Room ${message.payload.roomId} was newly created.`);
              break;
            default:
              console.warn(
                "WebSocket: Received unknown message type:",
                message.type
              );
          }
        }
      } catch (error) {
        console.error(
          "WebSocket: Failed to parse message or invalid message format:",
          event.data,
          error
        );
      }
    };
  }, [roomId, username, onOpen, onClose, onError, onMessageReceived]);

  const disconnectWebSocket = useCallback(() => {
    if (ws.current) {
      console.log("WebSocket: Closing connection.");
      ws.current.close();
      ws.current = null; // Ensure ref is cleared
      setIsConnected(false);
    }
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        if (!content.trim()) return; // Don't send empty messages
        console.log(`WebSocket: Sending message: ${content}`);

        // Detect if this is a drawing message (JSON array) or normal chat
        let isDrawingData = false;
        try {
          const parsed = JSON.parse(content);
          isDrawingData = Array.isArray(parsed);
        } catch (error) {
          // Not JSON data or not an array
          console.log("Not drawing data");
        }

        ws.current.send(
          JSON.stringify({
            type: "send_message",
            payload: {
              content,
              username,
              isDrawingData,
            },
          })
        );
      } else {
        console.error(
          "WebSocket: Cannot send message, connection is not open."
        );
      }
    },
    [username]
  );

  // Effect to connect and disconnect
  useEffect(() => {
    if (roomId && username) {
      connectWebSocket();
    } else {
      disconnectWebSocket(); // Disconnect if room/user changes to invalid
    }

    // Cleanup function to close WebSocket on component unmount or roomId/username change
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnectWebSocket();
    };
  }, [roomId, username, connectWebSocket, disconnectWebSocket]); // Re-run if roomId or username changes

  return { isConnected, sendMessage };
}
