// chat-app/client/src/types/index.ts

// Matches the ServerBroadcastMessage payload structure
export interface ChatMessage {
  content: string;
  sender: string; // 'system' or username
  timestamp: number;
  clientId?: string; // Optional: ID of the original sender
  isOwnMessage?: boolean; // Flag added on the client-side
}

// Add types for messages received by the client if they differ significantly
// For this simple app, ServerBroadcastMessage structure from backend types works well
// (You could copy/paste or share types via a shared package in a monorepo)

// Example of message structure expected from WebSocket server
export interface WebSocketMessage {
  type:
    | "chat_message"
    | "notify_user_joined"
    | "notify_user_left"
    | "error"
    | "room_created"
    | "your_id"; // Add any other types the server might send
  payload: {
    content: string;
    sender: string; // 'system' or username
    timestamp: number;
    clientId?: string; // Original sender's ID for 'chat_message'
    roomId?: string; // For 'room_created'
    yourId?: string; // For 'your_id'
  };
}
