FROM node:6.6.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

COPY index.js /usr/src/app

CMD [ "node_modules/.bin/supervisor", "index.js" ]
