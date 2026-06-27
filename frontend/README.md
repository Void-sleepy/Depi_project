# DevDocs AI Frontend

This is the frontend for the DevDocs AI RAG Assistant, built using React, Vite, and Tailwind CSS v4.

## Prerequisites

- Node.js (v18+ recommended)
- npm

## Installation

1. Navigate to this directory from the project root:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

## Development

To start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

## Project Structure

- `src/pages/` - Contains the main layout pages (`Landing.jsx` and `Chat.jsx`).
- `src/components/` - Contains the modular React components (e.g. `Nav`, `Hero`, `Messages`, `InputBar`).
- `src/css/` - Contains the base CSS styles and design tokens.
- `index.css` - The Tailwind CSS v4 entrypoint.

## Connecting to Backend

By default, the React application expects the FastAPI backend to be running on `http://localhost:8000`. Ensure that you start the backend API simultaneously for the chat features to function.
