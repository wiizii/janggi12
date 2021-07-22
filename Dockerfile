FROM node:alpine
RUN mkdir -p /usr/src/janggi12
WORKDIR /usr/src/janggi12 
COPY . /usr/src/janggi12 
RUN npm install
RUN npm install -g pm2@latest
CMD [pm2, start, app.js]
