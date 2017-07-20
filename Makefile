#
# This uses our internal PYPI to get the scp-buildtools package on start up.
#
PACKAGE=scp-project-templates
# actual package imported
IMPORT=scp_project_templates
VERSION=$(shell cat VERSION)
BIN=${VIRTUALENV}/bin
DOCKER_NAME=${PACKAGE}
DOCKER_VERSION=${VERSION}
DOCKER_IMAGE=${DOCKER_NAME}:${DOCKER_VERSION}
PYPI_URL_WITH_AUTH=https://pypi.supercarers.com

clean:
	find . -iname '*.pyc' -exec rm {} \; -print

install:
	python setup.py develop

test_install: install
	pip install -r test-requirements.txt

test: test_install
	pytest --junitxml=tests/report.xml --cov=${IMPORT}

release: clean test
	echo "No release done as its installed via github"

tag:
	# won't work inside docker box, jenkins after release will tag and
	# announce this.
	git tag ${VERSION}
	git push --tags


docker_build:
	docker build --build-arg PYPI_URL_WITH_AUTH=${PYPI_URL_WITH_AUTH} \
		-t ${DOCKER_IMAGE} .

docker_rebuild:
	docker build --build-arg PYPI_URL_WITH_AUTH=${PYPI_URL_WITH_AUTH} \
		--no-cache \
		-t ${DOCKER_IMAGE} .

docker_test: clean docker_build
	docker run -u 0 \
		-e PYPI_URL_WITH_AUTH=${PYPI_URL_WITH_AUTH} \
		${DOCKER_IMAGE} make test

docker_release: docker_test
	docker run -u 0 \
		-e PYPI_USER=${PYPI_USER} \
		-e PYPI_PASS=${PYPI_PASS} \
		-e PYPI_URL=${PYPI_URL} \
		-e PYPI_URL_WITH_AUTH=${PYPI_URL_WITH_AUTH} \
		${DOCKER_IMAGE} make release

docker_notify: docker_test
	echo "No release done as its installed via github"

docker_shell:
	docker run -u 0 -it ${DOCKER_IMAGE} bash
