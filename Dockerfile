FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy node_modules (built locally)
# Note: Run npm install locally before building the Docker image
COPY node_modules/ ./node_modules/

# Copy pre-built application
# Note: Build the application locally before building the Docker image
# Run: npm run build
COPY dist/ ./dist/

# Set environment variable placeholder
ENV GITHUB_TOKEN=""

# Run the server
CMD ["node", "dist/index.js"]
