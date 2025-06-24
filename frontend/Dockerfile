# Etapa 1: Build
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY . .

RUN npm install
RUN npm run build

# Etapa 2: Rodar o preview server do Vite
FROM node:18

WORKDIR /app

COPY --from=builder /app /app

# Muda a porta exposta
EXPOSE 5173

# Roda o preview na porta 5173
CMD ["npm", "run", "preview", "--", "--host", "--port", "5173"]
