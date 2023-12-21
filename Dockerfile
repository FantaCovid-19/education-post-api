FROM node:21.5-bookworm-slim as common_build_sata

COPY . /app
WORKDIR /app

RUN npm install
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "run", "start"]
