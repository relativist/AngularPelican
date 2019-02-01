FROM nginx

ARG COLUMNS=272
ARG LINES=67

ENV TERM=xterm \
    COLUMNS=$COLUMNS \
    LINES=$LINES

RUN apt-get update
RUN apt-get install -y mc

ADD ./mc /root/.config/mc

WORKDIR /var/www/pelican

ADD ./nginx /etc/nginx
ADD ./src /var/www/pelican

VOLUME /var/www/pelican

