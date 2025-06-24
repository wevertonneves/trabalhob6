# Etapa 1: build
FROM node:18 AS builder

WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências
COPY package*.json ./
RUN npm install

# Copia config e código-fonte
COPY tsconfig.json ./
COPY src ./src

# Compila o projeto
RUN npm run build

# Etapa 2: imagem final (produção)
FROM node:18

WORKDIR /app

# Copia somente o necessário da etapa de build
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm install --omit=dev

# (Opcional) copia o arquivo de env se for necessário no container
# COPY .env.docker .env

# Expõe a porta da API
EXPOSE 3000

# Define a variável de ambiente (boa prática)
ENV NODE_ENV=production

# Comando para rodar o app
CMD ["node", "dist/index.js"]
