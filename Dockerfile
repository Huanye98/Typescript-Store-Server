FROM node:14.17.0-alpine3.13

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

ENV PORT=5005

EXPOSE 5005

CMD ["start"]