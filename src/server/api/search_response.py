"""
SearchResponse : class used to set/get search results
create_search_results(arg:string) : function to return search results member of SearchResponse
"""

import requests
from flask import jsonify


class SearchResponse:
    """
    Class used to create a search response from the official star wars API
    
    Parameters
    ----------
    query: tuple 
        query[0] = category, query[1] = user input string
    """

    def __init__(self, query):
        self._query = query

    @property
    def results(self):
        return self._results

    @results.setter
    def results(self, value):
        def get_request(query):

            request_url = "https://swapi.co/api/{}/?search={}"
            swapi_search_url = request_url.format(query[0], query[1])

            response_data = requests.get(swapi_search_url)
            jsoned_response = jsonify(response_data.json())

            return jsoned_response

        value = get_request(self._query)
        self._results = value

    def __repr__(self):
        return "{} Response from SWAPI".format(self.results)


def create_search_results(query):
    search_results = SearchResponse(query)
    return search_results.results
