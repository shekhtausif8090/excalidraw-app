import WebSocket from "ws";

export interface WebSocketWithId extends WebSocket {
  clientId: string;
  roomId?: string;
}

export type MessageType =
  | "join_room"
  | "send_message"
  | "notify_user_joined"
  | "notify_user_left"
  | "error"
  | "room_created"
  | "chat_message";

export interface BaseMessage {
  type: MessageType;
}

export interface JoinRoomPayload {
  roomId: string;
  username: string;
}
export interface JoinRoomMessage extends BaseMessage {
  type: "join_room";
  payload: JoinRoomPayload;
}

export interface SendMessagePayload {
  content: string;
  username: string;
  isDrawingData?: boolean;
}
export interface SendMessage extends BaseMessage {
  type: "send_message";
  payload: SendMessagePayload;
}

export interface ServerMessagePayload {
  content: string;
  sender: string;
  timestamp: number;
  clientId?: string;
  isDrawingData?: boolean;
}
export interface ServerMessage extends BaseMessage {
  type: "chat_message" | "notify_user_joined" | "notify_user_left" | "error";
  payload: ServerMessagePayload;
}

export interface RoomCreatedPayload {
  roomId: string;
}
export interface RoomCreatedMessage extends BaseMessage {
  type: "room_created";
  payload: RoomCreatedPayload;
}

export type ClientMessage = JoinRoomMessage | SendMessage;
export type ServerBroadcastMessage = ServerMessage;
