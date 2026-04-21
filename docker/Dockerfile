FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN apk add --no-cache dumb-init

ENV NODE_ENV=production

EXPOSE 3000

USER node

CMD ["dumb-init", "node", "src/index.js"]