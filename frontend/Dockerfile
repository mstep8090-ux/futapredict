# Stage 1: Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package lists
COPY package*.json /app/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy frontend source files
COPY . /app/

# Build static production assets
RUN npm run build

# Stage 2: Production serve stage
FROM nginx:stable-alpine

# Copy built assets from build stage to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config for routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
