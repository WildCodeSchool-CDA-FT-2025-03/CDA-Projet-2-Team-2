FROM node:22-alpine

WORKDIR /app

COPY *.json ./

RUN npm install

COPY . .

EXPOSE 5050

CMD ["npm", "run", "dev"]