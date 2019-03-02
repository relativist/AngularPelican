SHELL=/bin/bash
.DEFAULT_GOAL:=help


.PHONY: help info
##@ Helpers

help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  \
	make [VARS] \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ \
	{ printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ \
	{ printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

################################################################################

TAG_FROM  := $(shell git rev-parse --abbrev-ref HEAD)
NOW_DATE:= $(shell date +%Y-%m-%d)
#TAG_BUILD := loyal-2.1.0
TAG_BUILD := $(TAG_FROM)
BUILD_ENV := dev

ifneq ($(BUILD_ENV), prod)
TAG_BUILD_PREF:=$(BUILD_ENV)
endif

IMAGE := "pelican-frontend:$(TAG_BUILD)-$(TAG_BUILD_PREF)"

BUILD_CMD := docker build -f Dockerfile \
	--build-arg TAG_FROM=$(TAG_FROM) \
	--build-arg TAG_BUILD_PREF=$(TAG_BUILD_PREF) \
	--build-arg BUILD_ENV=$(BUILD_ENV) \
	-t $(IMAGE) .

info: ## Info about
	@echo manage image $(IMAGE)
	@echo
	@echo TAG_FROM=$(TAG_FROM)
	@echo TAG_BUILD=$(TAG_BUILD)
	@echo BUILD_ENV=$(BUILD_ENV)
	@echo TAG_BUILD_PREF=$(TAG_BUILD_PREF)
	@echo
	@echo $(BUILD_CMD)

tar-source: ## tar the sources
	tar -czvf source.tar.gz ./src

scp-to-pi: ## scp to pi
	scp -P 5566 source.tar.gz alarm@usque.ru:~/pelican

deploy-on-pi: ## deploy to pi
	ssh alarm@usque.ru -p 5566 /home/alarm/pelican/./deploy.sh

dump: ## dump pelican schema
	pg_dump -n pelican -h usque.ru -p 9988 -U rest -W | gzip -3 -c > pelican-$(shell date +%Y-%m-%d).gz

##@ Docker
.PHONY: build push publish

build:  ## Build docker image. Use BUILD_ENV= (prod|...) to set build env.
	$(BUILD_CMD)

drun: ## Run image bash.
	docker run --rm -it $(IMAGE) bash

##@ Angular
.PHONY: src-clean npm-build build-all

src-clean: ## clean angular build
	rm -rf ./src

npm-build: ## build angular project
	npm run-script build

increment-version: ## increment version
	npm run-script postinstall

build-all: src-clean increment-version npm-build build ## build angular project an build docker image
build-and-deploy-on-pi: src-clean increment-version npm-build tar-source scp-to-pi deploy-on-pi ## deploy on docker
