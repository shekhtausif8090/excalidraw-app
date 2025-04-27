# Realtime Drawing App - Frontend

A simple frontend for a realtime collaborative drawing application using WebSockets.

## Features

- Create or join drawing rooms
- Draw rectangles in real-time
- See other users' drawings instantly
- Multiple color and line width options
- Clear canvas functionality

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the Frontend directory
3. Install dependencies

```bash
cd Frontend
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:5173

### Building for Production

To create a production build:

```bash
npm run build
```

## Usage

1. Enter your name and either create a new room or join an existing one
2. Draw rectangles by clicking and dragging on the canvas
3. Select different colors and line widths from the toolbar
4. All connected users in the same room will see your drawings in real-time

## Technologies Used

- React
- TypeScript
- Vite
- WebSockets
