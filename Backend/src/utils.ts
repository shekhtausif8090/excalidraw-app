export function generateClientId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
