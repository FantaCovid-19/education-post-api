FROM node:18 as common_build_sata

COPY . /app
WORKDIR /app

RUN npm install
RUN npm run build

EXPOSE 3000

# Development build stage
FROM common_build_sata as dev_build_stage
ENV NODE_ENV=development

CMD ["npm", "run", "dev"]

# Production build stage

FROM common_build_sata as prod_build_stage
ENV NODE_ENV=production

CMD ["npm", "run", "start"]
