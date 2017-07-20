Project Templates
=================

.. contents::


Introduction
------------

Project layout templates for various types of python projects for speedy
development bootstrapping. This uses the MrBob project behing the scenes.

 * http://mrbob.readthedocs.org/en/latest/


Set up
------

You can pip install the latest code version::

  pip install http://github.com/supercarers/scp-project-templates/tarball/master#egg=scp-project-templates


SCP Python Package
------------------

This create a SuperCarers standard python package for new projects. This could
be plugged-into our Jenkins CI and uses Docker + Makefile to test the new
package.::

    $ mrbob scp_project_templates:scppkg

    Welcome to mr.bob interactive mode. Before we generate directory structure, some questions need to be answered.

    Answer with a question mark to display help.
    Values in square brackets at the end of the questions show the default value if there is no answer.


    --> Project top level project name e.g. scp-newpackage, newpackage, etc.: scp-schema

    --> Python package or namespace to use e.g. scp_newpackage or scp.new.package: scp_schema
    :
    lots of output
    :
    log: Moving '/home/vagrant/src/tmp/64cd44a40822889f' into 'scp-schema'.
    Generated file structure at /home/vagrant/src/tmp

The current directory will now contain the new package::

    $ cd scp-schema
    $ ls
    build-requirements.txt  Dockerfile  Jenkinsfile  Makefile  MANIFEST.in  README.rst  requirements.txt  scp_schema  setup.cfg  setup.py  test-requirements.txt  VERSION

