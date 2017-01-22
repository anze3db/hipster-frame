# HipsterFrame Frontend

`react-start-app` will run in development mode (port 3000) when you run
docker-compose up.

## Useful commands:

1. Prod build

    ```bash
    $ docker-compose build frontend
    $ run frontend npm run build
    ```

    The build files will be in `frontend/build/`

2. Run tests

    ```bash
    $ docker-compose run frontend npm test
    ```

3. Coverage

    ```bash
    $ docker-compose run frontend npm test -- --coverage
    ```

    You can see the full coverage report by opening
    `coverage/lcov-report/index.html`
