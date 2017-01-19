FROM python:3.5

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /usr/src/app

CMD coverage run -m unittest discover src "*_test.py" && coverage report && python3 src/api.py --logging=debug
