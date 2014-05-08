# -*- coding: utf-8 -*-
"""
A light weight wrapper around pp-user-client REST client library. This gets
added to the pyramid request so its available in views if needed.

"""
import logging


def get_log(e=None):
    return logging.getLogger("{0}.{1}".format(__name__, e) if e else __name__)


class UserAPI(object):
    """
    """
    def __init__(self, request):
        """
        :param request: This is the pyramid request object.

        The request is passed into the view which is using this API.

        """
        from pp.user.client import rest

        self.log = get_log("UserAPI")
        self._settings = request.registry.settings
        self.user_uri = self._settings.get("pp.user.uri")
        self.log.debug("user_uri: <%s>" % self.user_uri)
        self.api = rest.UserService(uri=self.user_uri)
