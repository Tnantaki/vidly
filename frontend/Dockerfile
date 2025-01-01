# Step 1: Build stage
FROM node:23.0-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Define Backend URL on build stage
ENV VITE_API_URL="nodejs-backend:3000/api"
RUN ["npm", "run", "build"]

FROM nginx:alpine3.20
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]
