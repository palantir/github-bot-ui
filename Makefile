PATH  := ./node_modules/.bin:$(PATH)
SHELL := /bin/bash

version := $(shell git describe --tags)

build_dir := build
lib_dir   := $(build_dir)/lib

source_files := $(shell find src -type f)
build_files  := $(source_files:src/%.js=$(lib_dir)/%.js)

scss_files := $(wildcard src/*.scss)
css_bundle := $(build_dir)/github-bot-ui.css

.PHONY: all
all: clean check build

# Build
# -----

.PHONY: build
build: $(build_files) $(build_dir)/package.json $(css_bundle) $(build_dir)/README.md $(build_dir)/LICENSE

$(lib_dir)/%.js: src/%.js
	babel -d $(lib_dir) src

$(build_dir)/package.json: package.json
	VERSION=$(version) node scripts/clean-package-json.js $@

$(css_bundle): $(scss_files)
	node-sass $^ $@

$(build_dir)/%: %
	@mkdir -p $(dir $@)
	cp $< $@

# Test
# -----

.PHONY: check
check: lint

.PHONY: lint
lint:
	eslint src

# Utilities
# ---------

.PHONY: clean
clean:
	rm -rf $(build_dir)

.PHONY: print-version
print-version:
	@echo $(version)

# Local Development
# -----------------

.PHONY: watch
watch:
	node server.js
