FROM node:20-alpine

WORKDIR /app

# Copy lockfile + package.json → deterministic install
COPY package*.json ./

# In-container install (fresh every time)
RUN npm ci

# Copy source (no .next, no node_modules, thanks .dockerignore)
COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]