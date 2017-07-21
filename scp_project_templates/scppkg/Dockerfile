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

# build time only:
ARG PYPI_URL_WITH_AUTH
RUN make PYPI_URL_WITH_AUTH=${PYPI_URL_WITH_AUTH} install

USER scp
CMD make test
