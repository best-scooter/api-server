FROM node:18

WORKDIR /server

COPY dist/* ./dist/
COPY dist/constants/* ./dist/constants/
COPY dist/models/* ./dist/models/
COPY dist/orm/* ./dist/orm/
COPY dist/other/* ./dist/other/
COPY dist/routes/* ./dist/routes/
COPY env/* ./env/
COPY package*.json ./

EXPOSE 1337

RUN npm install

ENTRYPOINT [ "node", "/server/dist/index.js" ]
