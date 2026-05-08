FROM node:20-alpine
WORKDIR /app

RUN npm install -g pnpm

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --filter @mini-instagram/api... --frozen-lockfile

COPY apps/api ./apps/api

WORKDIR /app/apps/api

RUN pnpm run build

EXPOSE 3100
CMD ["pnpm", "start"]
