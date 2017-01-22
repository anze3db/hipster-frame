# HipsterFrame API

`docker-compose up` will run the API server in development mode. The server
will reload on code changes.

## Useful commands

1. Run tests

    ```bash
    $ docker-compose run api pytest
    ```

2. Coverage

    ```bash
    $ docker-compose run api pytest --cov=src
    ```
