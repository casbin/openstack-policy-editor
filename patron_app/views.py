# coding=utf-8

from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse
import json
import os
import shutil
import uuid
import time

# patron_dir = "C:/etc/patron"
patron_dir = os.path.dirname(os.path.abspath(__file__)) + "/../etc/patron"
command_dir = os.path.dirname(os.path.abspath(__file__)) + "/../etc/commands"

admin_tenant_id = "admin"


def get_403_error():
    return "ERROR (Forbidden): Policy doesn't allow this operation to be performed. (HTTP 403) (Request-ID: req-%s)" % uuid.uuid4()


def get_404_error():
    return "ERROR (Unsupported): This operation is unsupported. (HTTP 404) (Request-ID: req-%s)" % uuid.uuid4()


def MyHttpResponse(*args, **kwargs):
    response = HttpResponse(*args, **kwargs)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response["Access-Control-Max-Age"] = "1000"
    response["Access-Control-Allow-Headers"] = "*"
    return response


def tenants(request):
    if request.method != "GET":
        return MyHttpResponse("Unsupported HTTP method: " + request.method, content_type="text/html")

    response_data = []

    print "Searching: " + patron_dir + "/custom_policy"
    files = os.listdir(patron_dir + "/custom_policy")
    files.sort()
    i = 0
    display_names = {"admin": "Administrator",
                     "tenant1": "Company A",
                     "tenant2": "Company B",
                     "tenant3": "Company C"}
    for f in files:
        print f
        tmp_tenant = {}
        tmp_tenant['id'] = f
        tmp_tenant['name'] = display_names[f]
        response_data.append(tmp_tenant)
        i += 1

    return MyHttpResponse(json.dumps(response_data), content_type="application/json")


def models(request, model_name):
    if not os.path.exists(patron_dir + "/model/" + model_name):
        return MyHttpResponse("The model doesn't exist, model = " + model_name, content_type="text/html")
    model_path = patron_dir + "/model/" + model_name

    if request.method == 'GET':
        print "method = " + request.method + ", file to read = " + model_path
        file_object = open(model_path, 'r')
        try:
            rules = []
            while 1:
                line = file_object.readline()
                if not line:
                    break
                rules.append(line.rstrip("\n").rstrip("\r"))

            response_data = rules
            # metadata_text = file_object.read()
        finally:
            file_object.close()

        return MyHttpResponse(json.dumps(response_data), content_type="application/json")
    else:
        print "Unsupported method = " + request.method
        return MyHttpResponse("Unsupported HTTP method: " + request.method, content_type="text/html")


def metadata(request, tenant_id):
    if not os.path.exists(patron_dir + "/custom_policy/" + tenant_id):
        return MyHttpResponse("The tenant doesn't exist, tenant = " + tenant_id, content_type="text/html")
    metadata_path = patron_dir + "/custom_policy/" + tenant_id + "/metadata.json"

    if request.method == 'GET':
        print "method = " + request.method + ", file to read = " + metadata_path
        file_object = open(metadata_path, 'r')
        try:
            response_data = json.load(file_object)
            # metadata_text = file_object.read()
        finally:
            file_object.close()

        return MyHttpResponse(json.dumps(response_data), content_type="application/json")
    elif request.method == 'POST':
        print "method = " + request.method + ", file to write = " + metadata_path
        file_object = open(metadata_path, 'w')
        try:
            tmp = json.loads(request.body)
            jstr = json.dumps(tmp, ensure_ascii=False, indent=4)
            file_object.write(jstr.encode('utf-8'))
        finally:
            file_object.close()

            return MyHttpResponse("{\"status\":\"success\"}", content_type="text/html")
    else:
        print "Unsupported method = " + request.method
        return MyHttpResponse("Unsupported HTTP method: " + request.method, content_type="text/html")


def policy(request, tenant_id, policy_name):
    if not os.path.exists(patron_dir + "/custom_policy/" + tenant_id):
        return MyHttpResponse("The tenant doesn't exist, tenant = " + tenant_id, content_type="text/html")

    if os.path.exists(patron_dir + "/custom_policy/" + tenant_id + "/" + policy_name):
        policy_path = patron_dir + "/custom_policy/" + tenant_id + "/" + policy_name
    elif os.path.exists(patron_dir + "/" + policy_name):
        policy_path = patron_dir + "/" + policy_name
    else:
        return MyHttpResponse("The policy doesn't exist, tenant = " + tenant_id + ", policy = " + policy_name,
                            content_type="text/html")

    if request.method == 'GET':
        print "method = " + request.method + ", file to read = " + policy_path
        file_object = open(policy_path, 'r')
        try:
            rules = []
            while 1:
                line = file_object.readline()
                if not line:
                    break
                rules.append(line.rstrip("\n").rstrip("\r"))

            response_data = rules
            # metadata_text = file_object.read()
        finally:
            file_object.close()

        return MyHttpResponse(json.dumps(response_data), content_type="application/json")
    elif request.method == 'POST':
        print "method = " + request.method + ", file to write = " + policy_path
        file_object = open(policy_path, 'w')
        try:
            tmp = json.loads(request.body)
            rules = ""
            for line in tmp:
                rules += line + "\n"
            rules = rules.rstrip("\n")
            file_object.write(rules)
        finally:
            file_object.close()

            return MyHttpResponse("{\"status\":\"success\"}", content_type="text/html")
    else:
        print "Unsupported method = " + request.method
        return MyHttpResponse("Unsupported HTTP method: " + request.method, content_type="text/html")


def users(request, tenant_id):
    if request.method != "GET":
        return MyHttpResponse("Unsupported HTTP method: " + request.method, content_type="text/html")

    if not os.path.exists(patron_dir + "/custom_policy/" + tenant_id):
        return MyHttpResponse("The tenant doesn't exist, tenant = " + tenant_id, content_type="text/html")

    userlist_path = patron_dir + "/custom_policy/" + tenant_id + "/" + "users.txt"
    print "method = " + request.method + ", file to read = " + userlist_path
    file_object = open(userlist_path, 'r')
    user_list = file_object.read().split(",")
    response_data = user_list

    return MyHttpResponse(json.dumps(response_data), content_type="application/json")


def get_short_command(command):
    word_list = command.split(" ")
    if len(word_list) < 2:
        return command
    else:
        return word_list[0] + " " + word_list[1]


def get_action(command):
    m = {"nova list": "compute:get_all",
         "nova service-list": "compute_extension:services",
         "nova boot": "compute:create",
         "nova show": "compute:get",
         "nova delete": "compute:delete"}
    if m.has_key(command):
        return m[command]
    else:
        return ""


def get_object(command):
    word_list = command.split(" ")
    if len(word_list) < 3:
        return ""
    else:
        return word_list[len(word_list) - 1]


def get_command_output(command):
    output_path = command_dir + "/" + command + ".txt"
    try:
        file_object = open(output_path, 'r')
    except:
        return ""
    return file_object.read()


def enforce_command(tenant_id, sub, obj, act):
    if tenant_id == admin_tenant_id:
        res = True
        print "sub = " + sub + ", obj = " + obj + ", act = " + act + ", res = " + str(res)
        return res

    if act == "compute_extension:services":
        res = False
        print "sub = " + sub + ", obj = " + obj + ", act = " + act + ", res = " + str(res)
        return res

    if tenant_id == "tenant3":
        res = False
        print "sub = " + sub + ", obj = " + obj + ", act = " + act + ", res = " + str(res)
        return res

    if sub == "admin":
        res = True
        print "sub = " + sub + ", obj = " + obj + ", act = " + act + ", res = " + str(res)
        return res

    policy_path = patron_dir + "/custom_policy/" + tenant_id + "/custom-policy.json"
    try:
        file_object = open(policy_path, 'r')
    except:
        res = True
        print "sub = " + sub + ", obj = " + obj + ", act = " + act + ", res = " + str(res)
        return res

    if obj != "":
        rule = '"%s": "target_id:%s and user_id:%s"' % (act, obj, sub)
    else:
        rule = '"%s": "user_id:%s"' % (act, sub)
    print "rule = " + rule
    rules = file_object.read()
    if rule in rules:
        res = True
    else:
        res = False

    print "sub = " + sub + ", obj = " + obj + ", act = " + act + ", res = " + str(res)
    return res


def commands(request, tenant_id, user_name):
    if request.method != "GET":
        return MyHttpResponse("Unsupported HTTP method: " + request.method, content_type="text/html")

    response_data = ["nova list",
                     "nova service-list",
                     "nova boot --flavor m1.nano --image cirros --nic net-id=c4eb995e-748d-4684-a956-10d0ad0e73fd --security-group default vm1",
                     "nova show vm1",
                     "nova delete vm1"]
    return MyHttpResponse(json.dumps(response_data), content_type="application/json")


def command(request, tenant_id, user_name, command):
    #return MyHttpResponse("test", content_type="text/plain")

    if request.method != "GET":
        return MyHttpResponse("Unsupported HTTP method: " + request.method, content_type="text/html")

    if not os.path.exists(patron_dir + "/custom_policy/" + tenant_id):
        return MyHttpResponse("The tenant doesn't exist, tenant = " + tenant_id, content_type="text/html")

    userlist_path = patron_dir + "/custom_policy/" + tenant_id + "/" + "users.txt"
    print "method = " + request.method + ", file to read = " + userlist_path
    file_object = open(userlist_path, 'r')
    user_list = file_object.read().split(",")
    if user_name not in user_list:
        return MyHttpResponse("The user doesn't exist, tenant = " + tenant_id + ", user = " + user_name, content_type="text/html")

    print "method = " + request.method + ", tenant = " + tenant_id + ", user = " + user_name + ", command to run = " + command

    time.sleep(1)

    sub = user_name
    obj = get_object(command)
    act = get_action(get_short_command(command))
    if not enforce_command(tenant_id, sub, obj, act):
        response_data = get_403_error()
        return MyHttpResponse(response_data, content_type="text/plain")

    response_data = get_command_output(get_short_command(command))
    if response_data == "":
        response_data = get_404_error()
    return MyHttpResponse(response_data, content_type="text/plain")


def reset(request):
    return MyHttpResponse("{\"status\":\"%s\"}" % patron_dir, content_type="application/json")


def redirect_handler(request, url_path):
    return render(request, url_path + '.html')


def mainpage_handler(request):
    return render(request, 'Portal.html')
