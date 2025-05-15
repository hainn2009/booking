FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
# COPY package-lock.json ./

RUN npm install -g pnpm

RUN pnpm install
# RUN npm install

COPY . .

RUN pnpm run build
# RUN npm run build

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
# COPY package-lock.json ./
# COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

# only install dependencies not devDependencies
RUN pnpm install
# RUN pnpm install --prod
# RUN npm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]

