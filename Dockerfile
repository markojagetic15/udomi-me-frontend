# --- Faza 1: Buildanje React aplikacije ---
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# docker-compose.yml passes --build-arg VITE_API_URL=...; Vite only reads
# VITE_-prefixed vars from .env files or process.env at build time, and the
# app code reads import.meta.env.VITE_APP_BACKEND_URL, so both the ARG name
# and this ENV mapping must exist or the build bakes in `undefined`.
ARG VITE_API_URL
ENV VITE_APP_BACKEND_URL=$VITE_API_URL

# Ako koristiš Vite ili CRA za production build:
RUN npm run build

# --- Faza 2: Posluživanje preko Nginx-a ---
FROM nginx:alpine

# Kopiramo buildane statičke datoteke u Nginx folder
# Za Vite obično ide dist, a za Create React App ide build (promijeni 'dist' u 'build' ako je CRA)
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
