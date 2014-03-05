# -*- coding: utf-8 -*-
"""
Setuptools script for project-templates

"""
from setuptools import setup, find_packages

Name = 'project-templates'
ProjectUrl = ""
Version = "1.0.0dev"
Author = ''
AuthorEmail = ''
Maintainer = ''
Summary = ' Project file system layout projects for python and other languages. '
License = ''
Description = Summary
ShortDescription = Summary

needed = [
    'sphinx', # for docs generation.
    'mr.bob',
]

test_needed = [
]

test_suite = 'project.templates.tests'

EagerResources = [
    'project',
]

ProjectScripts = [
]

PackageData = {
    '': ['*.*'],
}

# Web Entry points
EntryPoints = """
"""

setup(
    url=ProjectUrl,
    name=Name,
    zip_safe=False,
    version=Version,
    author=Author,
    author_email=AuthorEmail,
    description=ShortDescription,
    long_description=Description,
    classifiers=[
      "Programming Language :: Python",
    ],
    keywords='web wsgi bfg pylons pyramid',
    license=License,
    scripts=ProjectScripts,
    install_requires=needed,
    tests_require=test_needed,
    test_suite=test_suite,
    include_package_data=True,
    packages=find_packages(),
    package_data=PackageData,
    eager_resources=EagerResources,
    entry_points=EntryPoints,
    namespace_packages=['project'],
)
