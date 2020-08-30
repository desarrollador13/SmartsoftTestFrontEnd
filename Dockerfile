# FROM node:12.11.1 
# #WORKDIR /app-web
# WORKDIR /app-web
# COPY . ./api-web
# COPY package.json ./
# RUN npm install -g @angular/cli@8
# RUN npm install
# EXPOSE 4200
# CMD ng serve --host 0.0.0.0
# "--host", "0.0.0.0"
# base image
FROM node:latest

#install chrome for protractor tests
#RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
#RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
#RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
WORKDIR /app-web
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install and cache app dependencies
COPY package.json /app-web/package.json
RUN npm install
#RUN npm install -g @angular/cli@7.3.7
RUN npm install -g @angular/cli@8
# add app
COPY . /app-web
# start app
CMD ng serve --host 0.0.0.0