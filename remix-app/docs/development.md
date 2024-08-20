# Stack

This stack was generated via the [Remix Blues Stack](./remix-blues-stack-docs.md).

# Dev Server

Development is done on gitpod.io. The config file is `.gitpod.yml`. When setting up a new workspace, the ecosystem should be automatically set up via the init scripts starting in `.gitpod.yml`.

The environment is optimized for VSCode, with extensions being defined both in `.vscode` and `.gitpod.yml`.

_`.env` note_: Should be generated via `.env-setup.sh`.

# CICD

CICD is done via GitHub Actions (see `.github/workflows/deploy.yml`).

# Production Deployment

When a project is pushed to `main`, it will deploy to `fly.io`.

The domain is hosted by GoDaddy.

_`.env` note:_ Something to keep in mind: The app will probably crash if environment variables aren't set during prod deployment.

# Common Issues

See/Add them on [when-code-gives-you-blues.md](./when-code-gives-you-lemons.md)
