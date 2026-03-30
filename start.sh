#!/bin/bash

# Start backend in background
echo "Starting backend..."
cd backend && npm run dev > backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid
echo "Backend started (PID: $BACKEND_PID)"

cd ..

# Start frontend in foreground
echo "Starting frontend..."
cd client && npm run dev
