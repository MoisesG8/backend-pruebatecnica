# Etapa de construcción
FROM node:18-alpine AS builder

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json e instalar deps
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el resto del código y compilar TS
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiar archivos de dependencias de producción
COPY package.json package-lock.json ./
RUN npm ci --production

# Copiar el código compilado desde builder
COPY --from=builder /usr/src/app/dist ./dist

# Exponer el puerto que usa tu servidor
EXPOSE 4000

# Comando por defecto
CMD ["node", "dist/server.js"]
