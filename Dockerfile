FROM node:16-alpine As development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:16-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY --from=development /app/package*.json ./
COPY --from=development /app/dist ./dist
COPY --from=development /app/.env .

CMD ["node", "dist/main"]

EXPOSE 4000