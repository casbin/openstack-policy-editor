/**
 * Created by potter on 2017/1/20.
 */
var userDb = [
    {   "username": "Admins (Cloud Platform Administrator)",
        "password": "111111",
        "id": "admin"
    },
    {
        "username": "schoolA",
        "password": "111111",
        "id": "tenant1"
    },
    {
        "username": "schoolB",
        "password": "111111",
        "id": "tenant2"
    },
    {
        "username": "schoolC",
        "password": "111111", 
        "id": "tenant3"
    }];
function login() {
    hideAllAlerts();
    //如果用户名为空就提示
    if (isUsernameEmpty())
        showUsernameAlert();
    //如果密码为空就提示
    else if (isPasswordEmpty())
        showPasswordAlert();
    //跟服务器请求
    else {
        var loginInfo = new Object();

        loginInfo.username = $("#username").val();
        loginInfo.password = $("#password").val();
        var loginStatus = false;
        for(var i=0;i<userDb.length;i++){
            console.log(userDb[i].username+""+loginInfo.username+""+userDb[i].password+""+loginInfo.password);
            if(userDb[i].username == loginInfo.username && userDb[i].password == loginInfo.password){
                $.alert({
                    title: "成功",
                    content:"登录成功",
                    animation: 'top',
                    type: 'green',
                    closeAnimation: 'bottom',
                    buttons: {
                        okay: {
                            text: "继续",
                            btnClass: 'btn-green',
                            action: function () {
                                location.href = "MetadataTree.html?tenant_id=" + userDb[i].id+"&tenant_name="+escape(userDb[i].username);
                            }
                        }
                    }
                });
                loginStatus = true;
                break;
            }
        }
        if(!loginStatus){
            $.alert({
                animation: 'none',
                title: false,
                type: 'red',
                content: '用户名/密码错误',
                buttons: {
                    okay: {
                        keys: [
                            'enter'
                        ],
                        text: '确定'
                    }
                }
            });
        }
        /*
        $.ajax({
            type: 'POST',
            url: "http://localhost:8080/login",
            data: JSON.stringify(loginInfo),
            success: function (data, status, xhr) {
                if (data.code == 200)
                    $.alert({
                        title: '成功',
                        content: "登录成功"
                    });
                else
                    $.alert({
                        title: '错误',
                        content: data.message
                    });
            },
            dataType: 'json',
            contentType: 'application/json'
        });*/
    }
}

function isUsernameEmpty() {
    return $("#username").val() == ""
}

function isPasswordEmpty() {
    return $("#password").val() == ""
}

function showUsernameAlert() {
    $("#username_alert").show();
}

function showPasswordAlert() {
    $("#password_alert").show();
}

function hideAllAlerts() {
    $("h6").hide();
}

