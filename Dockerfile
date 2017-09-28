# node.js good practices:
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md

#FROM node:6.3.1
FROM docker-registry-default.dapps.alephlb.com/openshift/nodejs-s2i-6:latest
# Create app directory
USER root

RUN mkdir -p /opt/app-root/src 
WORKDIR /opt/app-root/src 

# Override Environment Variables in the .env file
# ENV PORT 8081
# ENV DATABASE_SERVICE_NAME 172.17.0.2:27017

# Bundle app source
COPY . /opt/app-root/src 
RUN npm install

CMD [ "node", "app.js" ]

EXPOSE 8081
