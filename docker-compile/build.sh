#!/usr/bin/env bash

VER=latest

image=pelican-fronend-compile

image="${image}/hayatova.v/angular-builder:${VER}"
docker build -f Dockerfile \
    --build-arg ANGULAR_CLI_VERSION=$VER \
    -t $image .
