FROM node:6.3.1

RUN mkdir -p /usr/src/app/src /usr/src/app/public
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY src /usr/src/app
COPY public /usr/src/app/public

CMD [ "npm", "start" ]
