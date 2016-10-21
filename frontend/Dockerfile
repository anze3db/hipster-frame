FROM node:6.3.1

RUN mkdir -p /usr/src/app/src
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY src /usr/src/app
COPY index.html /usr/src/app

CMD [ "npm", "start" ]
