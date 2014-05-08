Project Docs
============

.. contents:


Quick start
-----------

Running all tests
~~~~~~~~~~~~~~~~~

This runs all unit and acceptance tests. The acceptance test will run the full
stack requiring all parts to run.

.. code-block: bash

    py.test -s

    # or

    python setup.py test


Run the server
~~~~~~~~~~~~~~

Run the server using the default development.ini do:

.. code-block: bash

    # control-c to exit
    cd service
    pserve development.ini
