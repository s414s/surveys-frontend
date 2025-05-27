FROM node:20-alpine

WORKDIR /app

ENV NEXT_PUBLIC_API_URL=http://ec2-3-88-185-85.compute-1.amazonaws.com

# Copy lockfile + package.json → deterministic install
COPY package*.json ./

# In-container install (fresh every time)
RUN npm ci

# Copy source (no .next, no node_modules, thanks .dockerignore)
COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]