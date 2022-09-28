FROM node:16-alpine 
LABEL "Name"="Todo web app"
WORKDIR /usr/src/app 
COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g nodemon
COPY . . 
ENV PORT=3000
EXPOSE $PORT 
ENTRYPOINT [ "nodemon", "run" ]
CMD [ "dev" ]