# -*- coding: utf-8 -*-
"""
Setuptools script for scp-project-templates (scp_project_templates)

"""
import sys
from setuptools import setup, find_packages
from setuptools.command.test import test as TestCommand


Name = 'scp-project-templates'
ProjectUrl = ""
with open('VERSION') as fd:
    Version = fd.read().strip()
Author = 'SuperCarers'
AuthorEmail = 'systems@supercarers.com'
Maintainer = ''
Summary = ''
License = ''
Description = Summary
ShortDescription = Summary

with open('requirements.txt') as fd:
    needed = fd.readlines()

EntryPoints = """
[console_scripts]
    scp-project-templates = scp_project_templates.scripts.main:main
"""


class PyTest(TestCommand):
    user_options = [('pytest-args=', 'a', "Arguments to pass to py.test")]

    def initialize_options(self):
        TestCommand.initialize_options(self)
        self.pytest_args = []

    def finalize_options(self):
        TestCommand.finalize_options(self)
        self.test_args = []
        self.test_suite = True

    def run_tests(self):
        # import here, cause outside the eggs aren't loaded
        import pytest
        errno = pytest.main(self.pytest_args)
        sys.exit(errno)


setup(
    url=ProjectUrl,
    name=Name,
    cmdclass={'test': PyTest},
    zip_safe=False,
    version=Version,
    author=Author,
    author_email=AuthorEmail,
    description=ShortDescription,
    long_description=Description,
    classifiers=[
        "Programming Language::Python",
    ],
    keywords='',
    license=License,
    install_requires=needed,
    include_package_data=True,
    packages=find_packages(),
    entry_points=EntryPoints,
    namespace_packages=[],
)
