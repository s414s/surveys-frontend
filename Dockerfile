FROM node:20-alpine

WORKDIR /app

# 1) Copy lockfile + package.json → deterministic install
COPY package*.json ./

# 2) In-container install (fresh every time)
RUN npm ci

# 3) Copy source (no .next, no node_modules, thanks .dockerignore)
COPY . .

# 4) Build Next.js
RUN npm run build

# 5) Expose & start
EXPOSE 3000
CMD ["npm", "run", "start"]