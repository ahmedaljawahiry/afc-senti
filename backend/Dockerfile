FROM python:3.10-slim

ENV PYTHONBUFFERED 1

RUN mkdir /app
WORKDIR /app

COPY requirements.txt /app/
RUN pip install -r requirements.txt
RUN python -m nltk.downloader vader_lexicon

COPY . /app/