# -*- coding: utf-8 -*-
"""
"""
import os
import codecs
import datetime


NAMESPACE_INIT = u"""
# -*- coding: utf-8 -*-
# See http://peak.telecommunity.com/DevCenter/setuptools#namespace-packages
__import__('pkg_resources').declare_namespace(__name__)
"""


def log(msg):
    print "log: {}".format(msg)


def describe_pkg(package_name):
    """Describe what paster should make from the given package.

    :param package_name: A new package or namespaced package to create.

    A namespace package is one determined from the 'dots' in the
    given package_name. For example "food.cheese" would create a
    namespace package "food" containing package "cheese". It can
    be arbitrarily deep for example "food.cheese.brie".

    Dotted names are split into namespace + depth + endpoint package

    E.g. pp.db.couchlisting

      pp (namesapce)
      +--common (package) <-+-- Depth
         +--db (package)  <-+
            +--couchlisting (actual package created from template.)


    :returns: A dict describing the package paster should create::

        package_name = "pp.db"

        correct = dict(
            output_dir="pp-common-db",
            egg="pp-common-db",
            package="db",
            project="pp-common-db",
            depth=['pp', 'common'],
        )

    """
    returned = dict(
        output_dir="",
        egg="",
        package="",
        project="",
        top="",
        namespaced_package="",
        namespace_packages=[],
        depth=[],
    )

    # lower case is the standard:
    package_name = package_name.lower()

    # Remove the path given in from a paster output_dir
    if package_name.startswith('./'):
        package_name = package_name[2:]

    # The egg, project are the same with '.' being replace with '-'. The
    # project and egg names are converted to lowercase.
    egg = package_name.replace('.', '-')
    project = egg

    names = package_name.split('.')

    # This is the last entry specified in the 'dot' path is the package
    package = names[-1]
    output_dir = "./%s" % package

    # Work out the depth if there is more the one entry.
    names.pop(-1)
    depth = names

    # This builds the 'namespace_packages' field for use with setuptools
    # setup scripts - each component needs the fully qual path to the
    # namespace package.
    namespace_packages = []
    if depth:
        for i, n in enumerate(depth):
            namespace_packages.append('.'.join(depth[:i + 1]))

    returned['output_dir'] = output_dir
    returned['egg'] = egg
    returned['package'] = package
    returned['project'] = project
    returned['top'] = depth[0] if depth else ""
    nsp = ".".join((depth + [package])) if depth else ""
    returned['namespaced_package'] = nsp
    returned['namespace_packages'] = namespace_packages
    returned['depth'] = depth

    return returned


def makedirs(path):
    """Make a director ignoring if its present already."""
    try:
        os.makedirs(path)
    except OSError:
        pass


def write_content(out_file, content=""):
    """Used to make __init__.py with or without content."""
    with codecs.open(out_file, 'w', encoding='utf-8') as f:
        f.write(content)


def pre_render_function(configurator):
    """Working out package variables from the namespace.

    This allows us to work out the package depth and other fields.

    """
    # print "Pre Render Variables In: ", configurator.variables
    project = configurator.variables['project']
    namespace = configurator.variables['namespace']
    description = describe_pkg(namespace)

    variables = {}
    depth = description['depth']
    variables['created'] = datetime.datetime.now().strftime(
        "%Y-%m-%dT%H:%M:%S"
    )
    variables['random_string'] = os.urandom(20).encode('hex')
    variables['namespace_path'] = depth
    variables['project'] = project
    variables['package'] = description['package']
    variables['egg'] = description['egg']
    variables['namespace'] = depth[0] if depth else ''
    variables['top'] = description['top']
    variables['namespaced_package'] = description['namespaced_package']
    variables['namespace_packages'] = description['namespace_packages']
    build_root = os.path.abspath(configurator.target_directory)
    rnd = os.urandom(8).encode('hex')
    variables['root'] = configurator.target_directory
    variables['build_root'] = os.path.join(build_root, rnd)
    configurator.target_directory = variables['build_root']
    makedirs(configurator.target_directory)

    configurator.variables = variables

    import pprint
    print "Pre Render Variables Out: ", pprint.pprint(configurator.variables)


def post_render_function(configurator):
    """Relocate the package created from the template into its place.
    """
    variables = configurator.variables

    # where the 'project' has been rendered to. The build_root will contain
    # a directory called variables['project']. We need to relocate this into
    # the namespaced package if this is a namespaced package.
    #
    root = variables['root']
    build_root = variables['build_root']

    if "namespace_path" in variables and variables['namespace_path']:
        log("{} is in directory: {}".format(variables['project'], build_root))

        top = variables['namespace_path'][0]
        log("Creating namespace package. Top level '{}'.".format(top))

        # Make the paths for the namespace e.g ['pp', 'common'] inside
        # the project folder
        #
        #  pp-common-db/
        #              pp/
        #                __init__.py : namespace init
        #                common/
        #                      __init__.py : standard init
        #
        # Make the pp-common-db/
        project_path = os.path.join(build_root, variables['project'])
        install_path = os.path.join(build_root, variables['project'])
        generated_pkg = os.path.join(build_root, variables['package'])
        makedirs(install_path)
        os.chdir(install_path)

        # Now make the sub directories:
        #print "---- %r " % variables['namespace_path']
        for path in variables['namespace_path']:
            makedirs(path)
            # change into this dir to make the next level down:
            os.chdir(path)
            # Build up the path to the final location package will be
            # moved into.
            install_path = os.path.join(install_path, path)
            write_content('__init__.py', NAMESPACE_INIT)

        os.chdir(build_root)

        # Now copy the generated packaged directory to the leaf of the
        # namespace tree.
        #
        log("Copying package '{}' into install_path '{}'.".format(
            variables['package'],
            install_path
        ))
        os.system("cp -a {} {}".format(variables['package'], install_path))

        # Copy the non directories from outside the package to the project
        # directory  e.g. the setup.py, README, etc.
        #
        log("Copying files into project_path '{}'.".format(project_path))
        os.system("cp * {} ".format(project_path))

        # Move the project directory into the root:
        log("Moving project '{}' into root '{}'.".format(
            project_path,
            root
        ))
        os.system("mv {} {}".format(project_path, root))

        # remove the build directory to clean up:
        log("Cleaning up. Removing build dir '{}'.".format(build_root))
        os.chdir(root)
        os.system("rm -rf {}".format(build_root))


def restservice_pre_render(configurator):
    """
    """
    # print "Pre Render Variables In: ", configurator.variables
    top_namespace = configurator.variables['top_namespace']
    package = configurator.variables['package']
    project = "{}-{}".format(top_namespace, package)
    namespace = "{}.{}".format(top_namespace, package)
    description = describe_pkg(namespace)

    variables = {}
    variables['created'] = datetime.datetime.now().strftime(
        "%Y-%m-%dT%H:%M:%S"
    )
    variables['name'] = namespace
    variables['capital_name'] = "".join(
        x.capitalize() for x in [top_namespace, package]
    )
    variables['random_string'] = os.urandom(20).encode('hex')
    variables['random_port'] = int(os.urandom(2).encode('hex'), 16)
    while variables['random_port'] < 60000:
        variables['random_port'] = int(os.urandom(2).encode('hex'), 16)
    variables['tcp_port'] = str(variables['random_port'])
    variables['project'] = project
    variables['package'] = package
    variables['egg'] = description['egg']
    variables['namespace'] = namespace
    variables['top_namespace'] = top_namespace
    variables['namespaced_package'] = description['namespaced_package']
    variables['namespace_packages'] = description['namespace_packages']
    build_root = os.path.abspath(configurator.target_directory)
    rnd = os.urandom(8).encode('hex')
    variables['root'] = configurator.target_directory
    variables['build_root'] = os.path.join(project)
    # this is the directory which contains the other parts:
    configurator.target_directory = variables['build_root']
    makedirs(configurator.target_directory)

    configurator.variables = variables

    import pprint
    print "Pre Render Variables Out: ", pprint.pprint(configurator.variables)


def restservice_post_render(configurator):
    """
    """


