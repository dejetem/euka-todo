# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Expose the server port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "dev"]
