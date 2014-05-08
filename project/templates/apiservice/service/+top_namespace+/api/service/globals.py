'''
Created on Mar 21, 2013

@author: ede
'''
import datetime


class RequestGlobals(object):
    """ Placeholder for user and other data
    """
    def __init__(self, request):
        self.request = request
        self.org_or_title = ""

    @property
    def current_year(self):
        return datetime.date.today().year
