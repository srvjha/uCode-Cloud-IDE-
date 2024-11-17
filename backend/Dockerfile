# Build stage
FROM node:20.12.2-bullseye AS builder

# Set the working directory
WORKDIR /build

# Install build dependencies
RUN apt-get update && \
    apt-get install -y \
    python3 \
    make \
    g++ \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies with npm ci and ensure the build is for the correct platform (Linux)
RUN npm ci --platform=linux --ignore-scripts

# Rebuild node-pty binary for the Linux platform
RUN npm rebuild node-pty --update-binary

# Final stage
FROM node:20.12.2-bullseye

# Set the working directory
WORKDIR /app

# Copy built node modules and binaries from the builder stage
COPY --from=builder /build/node_modules ./node_modules

# Copy application files
COPY . .

# Set environment variables (optional, but useful for terminal apps)
ENV TERM=xterm

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run","dev"]
