from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse
import json
import os


def users(request):
    if request.method != "GET":
        return HttpResponse("Unspported HTTP method: " + request.method, content_type="text/html")

    response_data = []

    patron_dir = "J:/etc/patron"
    files = os.listdir(patron_dir + "/custom_policy")
    i = 0
    for f in files:
        print f
        tmp_user = {}
        tmp_user['id'] = f
        tmp_user['name'] = "user " + str(i)
        response_data.append(tmp_user)
        i += 1

    return HttpResponse(json.dumps(response_data), content_type="application/json")
