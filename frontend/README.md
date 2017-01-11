# HipsterFrame Frontend

`react-start-app` will run in development mode (port 3000) when you run
docker-compose up.

Some additional comamnds:

1. Prod build

    ```
    $ docker-compose build frontend
    $ docker-compose run frontend node_modules/.bin/react-scripts build
    ```

    The build files will be in `frontend/build/`

2. Run tests

    ```
    $ docker-compose run frontend node_modules/.bin/react-scripts test --env=jsdom
    ```

3. Coverage

    ```
    $ node_modules/.bin/react-scripts test --env=jsdom --coverage
    ```

    You can see the full coverage report by opening
    `coverage/lcov-report/index.html`
