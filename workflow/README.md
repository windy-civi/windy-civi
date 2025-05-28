# Docker Based Workflow

Workflow steps overview:

1. `openstate_scrape` - scrape data using openstates scrapers
2. `builder` - process resulting data with windy civi transform

## Create necessary docker images

### openstates scraper

The openstates.org project provides a Docker file that can be used. They
currently publish docker images (via [GH actions][gha]) to dockerhub. See
https://hub.docker.com/r/openstates/scrapers

NOTE: Only images built for `amd64` platform are published to dockerhub. For
`arm64` you will need to build a compatible image.

```sh
% docker build . -t scrapers

# Run --help on the default entrypoint `openstates`
% docker run scrapers --help
```

[gha]: https://github.com/openstates/openstates-scrapers/blob/main/.github/workflows/docker.yml

### windy-civi builder

A simple [Dockerfile] is included with the builder script. Build the image:

```sh
% docker build . -t builder
```

[Dockerfile]: ../scraper_next/blockchain_builder/Dockerfile

## Run Workflow Steps

### Run step: `openstate_scrape`

```
% docker run \
    -v "$(pwd)/working/_data":/opt/openstates/openstates/_data \
    -v "$(pwd)/working/_cache":/opt/openstates/openstates/_cache \
    scrapers il bills --scrape --fastmode
```

### Run step: `builder`

```
% docker run \
    -v "$(pwd)/working":/data \
    -e BUILDER_INPUT_FOLDER=/data/_data/il \
    -e BUILDER_OUTPUT_FOLDER=/data/output \
    builder python main.py
```
