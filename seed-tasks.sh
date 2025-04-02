#!/bin/bash

echo "📤 Sending task: Buy groceries..."
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, and bread"}'

echo -e "\n✅ Task 1 sent.\n"

echo "📤 Sending task: Go RUN!..."
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Go RUN!", "description": "I need to get in shape"}'

echo -e "\n✅ Task 2 sent."
