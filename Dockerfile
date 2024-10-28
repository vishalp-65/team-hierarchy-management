# Use official Node.js image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire application code, including the .env file for local development
COPY . .

# Use a library like dotenv-cli to load .env variables in Node.js
RUN npm install -g dotenv-cli

# Set environment variables for production by default (can be overridden by .env in development)
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Expose necessary ports
EXPOSE 8082 8083

# Command to load environment variables from .env for development or use existing env variables for production
CMD ["sh", "-c", "dotenv -e .env -- npm start"]
