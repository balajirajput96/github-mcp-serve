FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Set environment variable placeholder
ENV GITHUB_TOKEN=""

# Run the server
CMD ["node", "dist/index.js"]
