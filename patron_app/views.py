# coding=utf-8

from django.http import HttpResponseRedirect
from django.shortcuts import render, render_to_response

# Create your views here.

from django.http import HttpResponse
import json
import os
import shutil

patron_dir = "C:/etc/patron"


def users(request):
    if request.method != "GET":
        return HttpResponse("Unsupported HTTP method: " + request.method, content_type="text/html")

    response_data = []

    files = os.listdir(patron_dir + "/custom_policy")
    i = 0
    display_mames = ["云平台管理员Admin", "张三", "李四", "王五"]
    for f in files:
        print f
        tmp_user = {}
        tmp_user['id'] = f
        tmp_user['name'] = display_mames[i]
        response_data.append(tmp_user)
        i += 1

    return HttpResponse(json.dumps(response_data), content_type="application/json")


def metadata(request, param1):
    if not os.path.exists(patron_dir + "/custom_policy/" + param1):
        return HttpResponse("The user doesn't exist, user = " + param1, content_type="text/html")
    metadata_path = patron_dir + "/custom_policy/" + param1 + "/metadata.json"

    if request.method == 'GET':
        print "method = " + request.method + ", file to read = " + metadata_path
        file_object = open(metadata_path, 'r')
        try:
            response_data = json.load(file_object)
            # metadata_text = file_object.read()
        finally:
            file_object.close()

        return HttpResponse(json.dumps(response_data), content_type="application/json")
    elif request.method == 'POST':
        print "method = " + request.method + ", file to write = " + metadata_path
        file_object = open(metadata_path, 'w')
        try:
            tmp = json.loads(request.body)
            jstr = json.dumps(tmp, ensure_ascii=False, indent=4)
            file_object.write(jstr.encode('utf-8'))
        finally:
            file_object.close()

            return HttpResponse("{\"status\":\"success\"}", content_type="text/html")
    else:
        print "Unsupported method = " + request.method
        return HttpResponse("Unsupported HTTP method: " + request.method, content_type="text/html")


def policy(request, param1, param2):
    if not os.path.exists(patron_dir + "/custom_policy/" + param1):
        return HttpResponse("The user doesn't exist, user = " + param1, content_type="text/html")

    if os.path.exists(patron_dir + "/custom_policy/" + param1 + "/" + param2 + ".json"):
        policy_path = patron_dir + "/custom_policy/" + param1 + "/" + param2 + ".json"
    elif os.path.exists(patron_dir + "/" + param2 + ".json"):
        policy_path = patron_dir + "/" + param2 + ".json"
    else:
        return HttpResponse("The policy doesn't exist, user = " + param1 + ", policy = " + param2,
                            content_type="text/html")

    if request.method == 'GET':
        print "method = " + request.method + ", file to read = " + policy_path
        file_object = open(policy_path, 'r')
        try:
            response_data = json.load(file_object)
            # metadata_text = file_object.read()
        finally:
            file_object.close()

        return HttpResponse(json.dumps(response_data), content_type="application/json")
    elif request.method == 'POST':
        print "method = " + request.method + ", file to write = " + policy_path
        file_object = open(policy_path, 'w')
        try:
            tmp = json.loads(request.body)
            jstr = json.dumps(tmp, ensure_ascii=False, indent=4)
            file_object.write(jstr.encode('utf-8'))
        finally:
            file_object.close()

            return HttpResponse("{\"status\":\"success\"}", content_type="text/html")
    else:
        print "Unsupported method = " + request.method
        return HttpResponse("Unsupported HTTP method: " + request.method, content_type="text/html")


def reset(request):
    shutil.rmtree(patron_dir)
    print "deleted " + patron_dir

    patron_copy_dir = patron_dir + "_copy"
    shutil.copytree(patron_copy_dir, patron_dir)
    print "copied from " + patron_copy_dir + " to " + patron_dir

    return HttpResponse("{\"status\":\"success\"}", content_type="application/json")


def redirect_handler(request, param1):
    return HttpResponseRedirect('static/' + param1 + '.html')
