# Canvas Flow - Realtime Collaborative Drawing Application

A modern, real-time collaborative drawing application that enables multiple users to work on shared canvases simultaneously. Perfect for brainstorming, teaching, or creative collaboration.

## Demo

[Watch the demo video](https://www.loom.com/share/62b1d9ba028c48b3a1e581d46b00a12c?sid=2da713c0-72f1-4069-95d0-e4bccebaa237) to see Canvas Flow in action.

## Features

### Core Functionality
- **Real-time Collaboration**: Multiple users can draw together simultaneously on the same canvas
- **Persistent Storage**: All drawings are automatically saved to the database and persist between sessions
- **Room-based Interaction**: Create or join specific drawing rooms with unique IDs
- **Intuitive Drawing Interface**: Simple and responsive UI for a smooth drawing experience

### Drawing Tools
- **Multiple Shape Types**: Draw rectangles, ellipses, and triangles
- **Customizable Styles**: Choose from various colors and line widths
- **Real-time Updates**: See other users' drawings instantly as they create them
- **Canvas Clearing**: Option to clear the entire canvas for all users in a room

### Authentication System
- **User Registration**: Secure signup process for new users
- **Login System**: Authentication using JSON Web Tokens (JWT)
- **Protected Routes**: Only authenticated users can create and join drawing rooms
- **User Identification**: Each drawing is associated with the user who created it

### Technical Features
- **WebSocket Communication**: Bidirectional real-time communication between users
- **Responsive Design**: Works on both desktop and mobile devices
- **Error Handling**: Robust error reporting and connection management
- **Optimized Performance**: Efficient canvas rendering and network communication

## Architecture

The application consists of two main components:

1. **Frontend**: React application with TypeScript, using WebSockets for real-time communication
   - Built with Vite for fast development and optimized production builds
   - Styled with Tailwind CSS for responsive design

2. **Backend**: Node.js server with Express and WebSockets
   - Prisma ORM for database operations
   - JWT-based authentication system
   - RESTful API for shape persistence
   - WebSocket server for real-time drawing updates

## Getting Started

### Prerequisites
- Node.js (>= 14.x)
- npm or yarn
- PostgreSQL database

### Installation

#### Backend Setup
1. Navigate to the Backend directory
```bash
cd Backend
npm install
```

2. Set up environment variables by creating a `.env` file with the following:
```
DATABASE_URL="postgresql://username:password@localhost:5432/drawing_app"
JWT_SECRET="your-secret-key"
PORT=8080
```

3. Run database migrations
```bash
npx prisma migrate dev
```

4. Start the backend server
```bash
npm run dev
```

#### Frontend Setup
1. Navigate to the Frontend directory
```bash
cd Frontend
npm install
```

2. Start the development server
```bash
npm run dev
```

The application will be available at http://localhost:5173

## Usage Guide

1. **Register or Login**: Create an account or log in with existing credentials
2. **Create or Join a Room**: Generate a new room ID or enter an existing one
3. **Start Drawing**: 
   - Select a shape type from the toolbar
   - Choose color and line width
   - Click and drag on the canvas to create shapes
4. **Collaborate**: Share the room ID with others to collaborate in real-time
5. **Save Automatically**: All drawings are automatically saved to the database

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - Vite
  - WebSocket API
  - Tailwind CSS

- **Backend**:
  - Node.js
  - Express
  - WebSocket (ws)
  - Prisma ORM
  - PostgreSQL
  - JSON Web Tokens (JWT)

## Future Enhancements

- Additional shape types and drawing tools
- Text annotations
- User permissions and role-based access
- Downloadable images of drawings
- Drawing history and version control
