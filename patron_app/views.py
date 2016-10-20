from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse
import json
import os

patron_dir = "J:/etc/patron"

def users(request):
    if request.method != "GET":
        return HttpResponse("Unsupported HTTP method: " + request.method, content_type="text/html")

    response_data = []

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

def metadata(request, param1):
    if not os.path.exists(patron_dir + "/custom_policy/" + param1):
        return HttpResponse("The user doesn't exist, user = " + param1, content_type="text/html")

    print "open path = " + patron_dir + "/custom_policy/" + param1 + "/metadata.json"
    file_object = open(patron_dir + "/custom_policy/" + param1 + "/metadata.json", 'r')
    print "file_object = " + str(file_object)

    try:
        metadata_text = file_object.read()
    finally:
        file_object.close()

    return HttpResponse(metadata_text, content_type="application/json")