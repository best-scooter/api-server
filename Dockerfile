FROM node:21

WORKDIR /server

COPY dist/* ./dist/
COPY dist/constants/* ./dist/constants/
COPY dist/models/* ./dist/models/
COPY dist/orm/* ./dist/orm/
COPY dist/other/* ./dist/other/
COPY dist/routes/* ./dist/routes/
# COPY env/* ./env/
COPY package*.json ./

EXPOSE 1337

RUN npm install

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:1337/v1/customer/auth || exit 1

ENTRYPOINT [ "node", "/server/dist/index.js" ]
