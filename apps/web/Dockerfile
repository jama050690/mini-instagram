FROM node:20-alpine
WORKDIR /app

RUN npm install -g pnpm

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --filter @mini-instagram/web... --frozen-lockfile

COPY apps/web ./apps/web

WORKDIR /app/apps/web

RUN pnpm exec tsc -b && pnpm exec vite build

EXPOSE 3200
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "3200"]
