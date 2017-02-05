FROM node:alpine

# create app directory 
RUN mkdir -p /usr/src/app 
WORKDIR /usr/src/app 

#install botkit
COPY package.json /usr/src/app/ 
RUN npm install 

#set startup commands
CMD ["npm", "run-script", "bot"]