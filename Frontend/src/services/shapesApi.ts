// API service for interacting with shapes endpoints

const API_URL = "http://localhost:8080/api";
const API_TIMEOUT = 10000; // 10 seconds timeout

export type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

// Utility function to add timeout to fetch
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT
): Promise<Response> => {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Fetch shapes for a room
export const getShapesForRoom = async (roomId: string): Promise<Shape[]> => {
  try {
    console.log(`[shapesApi] Fetching shapes for room ${roomId}`);
    const response = await fetchWithTimeout(`${API_URL}/shapes/${roomId}`);

    if (!response.ok) {
      let errorMessage = "Failed to fetch shapes";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If we can't parse the error as JSON, just use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const shapes = await response.json();
    console.log(
      `[shapesApi] Successfully fetched ${shapes.length} shapes for room ${roomId}`
    );
    return shapes;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(
        `[shapesApi] Request timeout fetching shapes for room ${roomId}`
      );
      return [];
    }
    console.error(
      `[shapesApi] Error fetching shapes for room ${roomId}:`,
      error
    );
    return [];
  }
};

// Update shapes for a room
export const updateShapesForRoom = async (
  roomId: string,
  shapes: Shape[]
): Promise<boolean> => {
  try {
    console.log(
      `[shapesApi] Updating ${shapes.length} shapes for room ${roomId}`
    );
    const response = await fetchWithTimeout(`${API_URL}/shapes/${roomId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shapes),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update shapes";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        if (errorData.details) {
          errorMessage += `: ${errorData.details}`;
        }
      } catch (e) {
        // If we can't parse the error as JSON, just use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    console.log(`[shapesApi] Successfully updated shapes for room ${roomId}`);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(
        `[shapesApi] Request timeout updating shapes for room ${roomId}`
      );
      return false;
    }
    console.error(
      `[shapesApi] Error updating shapes for room ${roomId}:`,
      error
    );
    return false;
  }
};

// Clear all shapes for a room
export const clearShapesForRoom = async (roomId: string): Promise<boolean> => {
  try {
    console.log(`[shapesApi] Clearing all shapes for room ${roomId}`);
    const response = await fetchWithTimeout(`${API_URL}/shapes/${roomId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      let errorMessage = "Failed to clear shapes";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If we can't parse the error as JSON, just use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    console.log(
      `[shapesApi] Successfully cleared all shapes for room ${roomId}`
    );
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(
        `[shapesApi] Request timeout clearing shapes for room ${roomId}`
      );
      return false;
    }
    console.error(
      `[shapesApi] Error clearing shapes for room ${roomId}:`,
      error
    );
    return false;
  }
};
