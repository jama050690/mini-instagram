FROM node:20-alpine

WORKDIR /app

# pnpm o'rnatish
RUN npm install -g pnpm

# Kutubxonalarni o'rnatish
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Barcha kodlarni ko'chirish
COPY . .

# Fastify loyihasini build qilish (typescript bo'lsa)
RUN pnpm run build:api

# Portni ochish (sizning compose faylingizga ko'ra 3100)
EXPOSE 3100

# Fastify-da hostni 0.0.0.0 qilish juda muhim
ENV FASTIFY_ADDRESS=0.0.0.0

CMD ["pnpm", "run", "start"]