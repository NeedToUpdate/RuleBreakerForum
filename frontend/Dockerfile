FROM node:16-alpine

WORKDIR /app

COPY . .


RUN npm install -D @swc/cli @swc/core
RUN npm install


CMD ["npm", "run", "dev"]