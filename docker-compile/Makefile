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
CURR_PATH := $(realpath ..)
EXECCOMMAND := $(shell echo "SRC_DIR=$(CURR_PATH)" > .env)
TAG_BUILD := $(TAG_FROM)
BUILD_ENV := dev
VER=latest

ifneq ($(BUILD_ENV), prod)
TAG_BUILD_PREF:=$(BUILD_ENV)
endif

IMAGE := "pelican-fronend-compile"

BUILD_CMD := docker build -f Dockerfile \
	--build-arg TAG_FROM=$(TAG_FROM) \
	--build-arg TAG_BUILD_PREF=$(TAG_BUILD_PREF) \
	--build-arg ANGULAR_CLI_VERSION=$(VER) \
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

tar: ## tar the sources
	tar -czvf source.tar.gz ./src


##@ Docker
.PHONY: build push publish

build:  ## Build docker image. Use BUILD_ENV= (prod|...) to set build env.
	@echo $(CURR_PATH)
	$(EXECCOMMAND)
	$(BUILD_CMD)

prebuild:  ## Build docker image. Use BUILD_ENV= (prod|...) to set build env.
	@echo $(CURR_PATH)
	$(EXECCOMMAND)

push: $(docker inspect --format={{.Created}} $(IMAGE)) ## Push docker image to repo. Use BUILD_ENV=dev (prod|...) to set build env.
	docker push $(IMAGE)

publish: build push  ## Publish docker image. Use BUILD_ENV= (prod|...) to set build env.

drun: ## Run image bash.
	docker run --rm -it $(IMAGE) bash

##@ Angular
.PHONY: src-clean npm-build build-all

src-clean: ## clean angular build
	rm -rf ./src

npm-build: ## build angular project
	npm run-script build

build-all: src-clean npm-build build ## build angular project an build docker image

