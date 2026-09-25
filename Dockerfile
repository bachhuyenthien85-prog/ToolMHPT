FROM node:22-slim

# Build tools for better-sqlite3 native compilation
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first (cached layer)
COPY package.json ./
RUN npm install --omit=dev

# Copy app source
COPY server/ server/
COPY public/ public/
COPY lib/ lib/
COPY auto/ auto/
COPY *.html *.js ./

# Persistent data directory for SQLite
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["node", "server/server.js"]
