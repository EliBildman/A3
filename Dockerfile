FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
COPY . .

ENV STAGE=release

CMD [ "npm", "start" ]