FROM python:3.13-alpine

WORKDIR /app

COPY Pipfile Pipfile.lock ./

RUN pip install pipenv && \
  pipenv install --deploy --ignore-pipfile

COPY . .
