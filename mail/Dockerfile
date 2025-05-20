FROM node:22-alpine

WORKDIR /app

COPY ./src ./src

COPY *.json ./

RUN npm install

EXPOSE 3030

CMD ["npm", "run", "dev"]