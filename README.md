# Hipster Frame [![CircleCI](https://circleci.com/gh/Smotko/hipster-frame.svg?style=svg)](https://circleci.com/gh/Smotko/hipster-frame) [![codecov](https://codecov.io/gh/Smotko/hipster-frame/branch/master/graph/badge.svg)](https://codecov.io/gh/Smotko/hipster-frame)


## Set up dev environment

```bash
# Create a local docker-compose.yaml file and add the Instagram API keys:
$ cp docker-compose.override.yml{.example,} && vim docker-compose.override.yml
# Run the app (it will be available on localhost:8080):
$ docker-compose up
```

## Running tests

```bash
# Run continuous test runner for api:
$ docker-compose run api ptw
# Run continuous test runner for frontend:
$ docker-compose run frontend npm test -- --watch
```
