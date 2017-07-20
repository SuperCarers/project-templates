FROM python:2.7.13-slim

WORKDIR /app
RUN useradd scp

RUN apt-get update && apt-get install -y make

ADD Makefile .
ADD VERSION .

ADD requirements.txt .
ADD test-requirements.txt .
ADD setup.py .
ADD . .

RUN make install

USER scp
CMD make test
