# frontend/Dockerfile
################### BUILD STAGE ###################
FROM node:20-alpine AS build

WORKDIR /app

# Copy only package.json first
COPY package*.json ./

# Install deps as root (default)
RUN npm ci --only=production

# Copy rest of the code
COPY . .

# Use build arg
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

################### PRODUCTION STAGE ###################
FROM nginx:alpine

# copy the built artifact from the above stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose Port
EXPOSE 80




