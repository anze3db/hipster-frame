FROM node:6.7.0

RUN mkdir -p /usr/src/app/src
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

COPY src/index.js /usr/src/app/src

CMD [ "node_modules/.bin/supervisor", "index.js" ]
