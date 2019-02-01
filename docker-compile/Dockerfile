ARG ANGULAR_CLI_VERSION=latest

FROM node:10

MAINTAINER Sitnikov

ENV TERM=xterm

RUN apt-get update && apt-get install -y --force-yes mc

USER node

ENV ANGULAR_CLI_VERSION=$ANGULAR_CLI_VERSION \
    COLUMNS=272 \
    LINES=67

RUN mkdir /home/node/.npm-global ; \
    mkdir -p /home/node/app ; \
    chown -R node:node /home/node/app ; \
    chown -R node:node /home/node/.npm-global

ENV PATH=/home/node/.npm-global/bin:$PATH \
    NPM_CONFIG_PREFIX=/home/node/.npm-global

WORKDIR /home/node/app

RUN npm install -g @angular/cli@$ANGULAR_CLI_VERSION

ADD /mc /home/node/.config/mc

EXPOSE 4200 49153

#CMD ["npm", "run-script", "build"]
#CMD ["npm", "run-script", "start"]
CMD ["ng", "serve", "--host", "0.0.0.0"]
#CMD ["ng", "serve", "--host", "axpl-admin"]

