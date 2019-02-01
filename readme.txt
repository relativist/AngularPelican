2 dockers to manage Angular-Frontend

1. DOCKER - To compile sources
a. cd docker-compile
b. make build
c. docker-compose up
with command: npm install
d. docker-compose up
with command: npm run-script start

2. DOCKER - To run application
cd docker
- make npm-build (compile if necessary)
make build
docker-compose up
go to localhost:80

---------------------------
for debug:
#alias dex="docker exec -it"
attach ->  dex pelican-fronend-compile bash

# Delete all containers
docker rm $(docker ps -a -q)
# Delete all images
docker rmi -f $(docker images -q)

---------------------------
# update all versions
npm install -g npm-check-updates
ncu -u
npm update
npm install
