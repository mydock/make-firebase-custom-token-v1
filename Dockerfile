FROM node:alpine

WORKDIR /app

ADD . .

RUN npm i --no-package-lock

CMD ["node", "."]
