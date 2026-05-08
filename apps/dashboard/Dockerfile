FROM node:20-alpine
WORKDIR /app

RUN npm install -g pnpm

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/dashboard/package.json apps/dashboard/package.json

RUN pnpm install --filter @mini-instagram/dashboard... --frozen-lockfile

COPY apps/dashboard ./apps/dashboard

WORKDIR /app/apps/dashboard

RUN pnpm exec tsc -b && pnpm exec vite build

EXPOSE 5100
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "5100"]
