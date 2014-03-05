# -*- coding: utf-8 -*-
import unittest

from project.templates import utils



def test_ArbitraryDepthNamespacePackage():
    """Test the generation of namespaced arbitrary depth packages ie.
    a.b.c  a & b are namespaces c is the packages delivered.
    """
    given_pkg = "pp.magic"

    correct = {
        'namespaced_package': 'pp.magic',
        'package': 'magic',
        'top': 'pp',
        'project': 'pp-magic',
        'namespace_packages': ['pp'],
        'depth': ['pp'],
        'output_dir':
        './magic',
        'egg': 'pp-magic'
    }

    results = utils.describe_pkg(given_pkg)

    print "\n\ncorrect:\n%s\nresult:\n%s\n\n" % (correct, results)

    assert results == correct

    given_pkg = "pp.db"

    correct = {
        'namespaced_package': 'pp.db',
        'package': 'db',
        'top': 'pp',
        'project': 'pp-db',
        'namespace_packages': ['pp'],
        'depth': ['pp'],
        'output_dir': './db',
        'egg': 'pp-db'
    }

    assert utils.describe_pkg(given_pkg) == correct

    # Handle the paster output_dir being passed in:
    given_pkg = "./pp.db"

    correct = {
        "project": "pp-db",
        "namespace_packages": [
            "pp"
        ],
        "depth": [
            "pp"
        ],
        "namespaced_package": "pp.db",
        "output_dir": "./db",
        "package": "db",
        "top": "pp",
        "egg": "pp-db"
    }

    assert utils.describe_pkg(given_pkg) == correct


def test_non_namespaced_generation():
    given_pkg = "magic"

    correct = {
        'namespaced_package': '',
        'package': 'magic',
        'top': '',
        'project': 'magic',
        'namespace_packages': [],
        'depth': [],
        'output_dir':
        './magic',
        'egg': 'magic'
    }

    assert utils.describe_pkg(given_pkg) == correct

    given_pkg = "Magic"

    correct = {
        'namespaced_package': '',
        'package': 'magic',
        'top': '',
        'project': 'magic',
        'namespace_packages': [],
        'depth': [],
        'output_dir':
        './magic',
        'egg': 'magic'
    }

    assert utils.describe_pkg(given_pkg) == correct


def testSetuptoolsNamepacePackages():
    """ Tests just the bit that generates setuptools'
    namespace_packages field
    """
    given_pkg = "pp.magic.unicorns.charlie"
    res = utils.describe_pkg(given_pkg)
    assert res['namespace_packages'] == ['pp', 'pp.magic', 'pp.magic.unicorns']
