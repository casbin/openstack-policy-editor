function afterFirstSelectorChanged(key) {
    $("#action_menu").empty();
    //为啥用 policy_array.key不行：需要硬编码
    var first_array = policy_array[key];
    for (var options in first_array) {
        $("#action_menu").append('<li><input type="radio" id="' + first_array[options] + '"name="action_menu"><label for="' + first_array[options] + '">' + first_array[options] + '</label></li>');   //为Select追加一个Option(下拉项)
    }
    $("#action_menu").find("li input").first().click();//选中第一个元素
};

function afterThirdSelectorClicked(texts) {
    $("#value_memu_btn").html(texts + '<span class="caret"></span>');//下三角还是要有的，通过这个caret实现
};

function afterDeleteListItem(key) {
    //用正则表达式取出Key
    var reg = new RegExp('"(.*)": ".*"');
    var str2 = key.text().replace(reg, "$1").trim();//不知道为啥有个空格
    console.log(str2);
    key.remove();
    delete current_json[str2];//删除current_json中元素
};

//将策略添加到json中
function save_this_policy() {
    var name = $("#name_memu_btn").text().trim();
    var action = $("#action_memu_btn").text().trim();
    var value = $("#value_memu_btn").text().trim();

    if (value.indexOf("空") >= 0)
        value = "";
    key = name + "\:" + action;
    //如果有重复的会问是否覆盖
    if (current_json.hasOwnProperty(key)) {
        if (confirm("已存在同名策略，是否要覆盖？") == true) {
            current_json[key] = value;//添加属性
            //删除某个点比较困难，直接刷新吧哈哈
            show_policy_list();
            alert("添加成功");
        }
    } else {
        current_json[key] = value;//添加属性
        $("#policy-list-group").prepend('<li class="list-group-item"> <a class="key-color">\"' + key + '\"</a>: <a class="value-color">\"' + value + '\"</a><span><img class="pointer-as-hand delete-btn " src="images/delete.png"  onclick="afterDeleteListItem($(this).closest(\'.list-group-item\'))"/></span></li>');   //prepend可以添加在开头
        alert("添加成功");
    }
    console.log(name + ":" + action + ":" + value)
};

//将Rule添加到json中并刷新界面
function save_this_rule() {
    var name = $("#rule_name").val().trim();
    var value = $("#value_memu_btn").text().trim();
    if ($('#rule_radio_1').is(':checked')) { //判断哪个被选中
        value = "is_admin:True";
    } else if ($('#rule_radio_2').is(':checked')) {
        value = "is_admin:False";
    } else if ($('#rule_radio_3').is(':checked')) {
        value = $("#rule_value").val();
    }
    //判断规则名是否为空
    if (name == "") {
        alert("请输入规则名");
        return;
    }
    if (name.indexOf(":") != -1) {
        alert("规则名中禁止出现冒号");
        return;
    }
    //如果有重复的会问是否覆盖
    if (custom_rule.hasOwnProperty(name)) {
        if (confirm("已存在同名规则，是否要覆盖？") == true) {
            custom_rule[name] = value;//添加属性
            show_sub_rule_menu();//刷新rule子菜单
            show_rule_list();
            alert("添加成功");
        }
    } else {
        custom_rule[name] = value;//添加属性
        show_sub_rule_menu();//刷新rule子菜单
        $("#rule-list-group").prepend('<li class="list-group-item"><a class="text-warning">\"' + name + '\"</a>: <a class="text-info">\"' + value + '\"</a><span><img class="pointer-as-hand delete-btn " src="images/delete.png"  onclick="afterDeleteRuleListItem($(this).closest(\'.list-group-item\'))"/></span></li>');   //在开头添加
        alert("添加成功");
    }
};

//刷新rule menu子菜单
function show_sub_rule_menu() {
    $("#value_sub_menu").empty();
    //修改自定义规则子菜单
    for (key in custom_rule) {
        $("#value_sub_menu").append('<li><a href="#" tabindex="-1" onclick="afterThirdSelectorClicked($(this).text())" title="' + custom_rule[key] + '">' + key + '</a></li>');
    }
}

//刷新policy列表
function show_policy_list() {
    $("#policy-list-group").empty();
    for (key in current_json) {
        $("#policy-list-group").append('<li class="list-group-item"> <a class="key-color">\"' + key + '\"</a>: <a class="value-color">\"' + current_json[key] + '\"</a><span><img class="pointer-as-hand delete-btn " src="images/delete.png"  onclick="afterDeleteListItem($(this).closest(\'.list-group-item\'))"/></span></li>');   //styles
    }
}

//刷新rule列表
function show_rule_list() {
    $("#rule-list-group").empty();
    for (key in custom_rule) {
        $("#rule-list-group").append('<li class="list-group-item"><a class="text-warning">\"' + key + '\"</a>: <a class="text-info">\"' + custom_rule[key] + '\"</a><span><img class="pointer-as-hand delete-btn " src="images/delete.png"  onclick="afterDeleteRuleListItem($(this).closest(\'.list-group-item\'))"/></span></li>');   //styles
    }//这里parent是寻找list-group-item这个父元素
}

//删除rule中元素
function afterDeleteRuleListItem(key) {
    //用正则表达式取出Key
    var reg = new RegExp('"(.*)": ".*"');
    var str2 = key.text().replace(reg, "$1").trim();//不知道为啥有个空格
    key.remove();
    delete custom_rule[str2];//删除current_json中元素
}

function merge_rule_and_policy() {
    result = $.extend({}, current_json, custom_rule);//合并两个js对象
    return result;
}

//post并后退
function postPolicyToServer(user_id, policy_name) {
    var json = merge_rule_and_policy();
    alert(JSON.stringify(json));
    //以json格式发送就需要用stringify这个函数
    $.post(base_url + "users/" + user_id + "/" + policy_name+"/", JSON.stringify(json), function (data) {
        //console.log("save_policy_success:" + policy_name + ":" + data);
        alert("保存成功"); 
        //history.go(-1);
    }, "json");
}

//从url中获取参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}