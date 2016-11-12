/**
 * Created by potter on 2016/10/24.
 * 树插件：http://www.treejs.cn/
 */
//递归转成zTree的基本格式
// 基本格式：{name(必须有，显示为节点名) , ***(其他属性) , children:[{},{}]
//zTree支持根节点为数组或对象(都可以)，此处选择根节点为对象

function originTree2FormatTree(realRootNode) {
    //因为zTree会把name属性作为节点名字，而实际上节点名字需要是display-name，因此需要转换下
    realRootNode.realName = realRootNode.name;
    realRootNode.name = realRootNode["display-name"];
    delete realRootNode["display-name"];
    if (realRootNode["type"] == "op-and" || realRootNode["type"] == "op-or") {
        var childnames = realRootNode["content"].split(",");
        var child1name = trimStr(childnames[0]);
        var child2name = trimStr(childnames[1]);
        var child1 = realRootNode[child1name];
        var child2 = realRootNode[child2name];
        realRootNode["children"] = [child1, child2];
        realRootNode["content"] = realRootNode["content"].replace(/\s/g, "");//去除里面所有空格，方便后面删除元素的处理
        originTree2FormatTree(child1);
        originTree2FormatTree(child2);
        delete realRootNode[child1name];
        delete realRootNode[child2name];
    }
}

//将ztree格式转回metadata.json格式
function formatZTreeToOriginTree(zTreeNodes) {
    var root_policy_str = zTreeNodes["realName"];
    var rootNode = new Object();
    rootNode[root_policy_str] = zTreeNodes;
    rootNode["current-policy"] = root_policy_str;
    if (changeChildrenToAttr(rootNode[root_policy_str]))
        return rootNode;
    else
        return false;
}

//判断user_id是否全部为0
function isAdmin(){
    return /^0+$/ig.test(user_id);
}

//递归删除多余属性，把children数组变成一个个属性.同时检查是否有单子节点的children数组.
function changeChildrenToAttr(rootNode) {
    //删除一些属性
    delete rootNode.id;
    delete rootNode.level;
    delete rootNode.tId;
    delete rootNode.parentTId;
    delete rootNode["open"];
    delete rootNode.isParent;
    delete rootNode.zAsync;
    delete rootNode.isFirstNode;
    delete rootNode.isLastNode;
    delete rootNode.isAjaxing;
    delete rootNode.pId;
    delete rootNode["checked"];
    delete rootNode.checkedOld;
    delete rootNode.nocheck;
    delete rootNode.chkDisabled;
    delete rootNode.halfCheck;
    delete rootNode.check_Child_State;
    delete rootNode.check_Focus;
    delete rootNode.isHover;
    delete rootNode.editNameFlag;
    //因为zTree会把name属性作为节点名字，而实际上节点名字需要是display-name，因此需要转换下。这里是转换回来
    rootNode["display-name"] = rootNode.name;
    rootNode.name = rootNode.realName;
    delete rootNode.realName;

    var bool = true;
    if (rootNode.hasOwnProperty("children")) {
        if (rootNode.children.length >= 2 || rootNode.children.length == 0) {
            var arrays = rootNode.children;
            for (obj in arrays) {
                name1 = arrays[obj].realName;
                rootNode[name1] = arrays[obj];
                bool = bool && changeChildrenToAttr(rootNode[name1]);
            }
            delete rootNode.children;
            return bool;//返回递归后的结果
        } else {
            return false;//如果只有一个子节点就返回false
        }
    } else {
        return true;
    }
}

function showJSON(tag) {
    deepCopy = $.extend(true, {}, zTreeObj.getNodes()[0]);
    console.log(tag + ": " + JSON.stringify(formatZTreeToOriginTree(deepCopy)));
}

//保存并后退
function save() {
    var deepCopyOfTree = $.extend(true, {}, zTreeObj.getNodes()[0]);//深复制
    treedata = formatZTreeToOriginTree(deepCopyOfTree);
    if (treedata != false)
        alert("保存成功！");
    else
        alert("任意父节点不能仅有一个子节点，请重新检查！");
    $.post(base_url + "users/" + user_id+"/", JSON.stringify(treedata), function (data) {
        console.log("save_tree_success:");
        history.go(-1);
    }, "json");
    console.log(JSON.stringify(treedata));
}

function findIfExistDuplicatePolicyName(name) {
    return false;
}

//从a,b,c,d,e中删除某个元素->a,b,c,e
function deleteItemFromContent(content, item) {
    var content_array = content.split(",");
    var newcontent = "";
    for (var i = 0; i < content_array.length; i++) {
        if (content_array[i] == item) {
            continue;
        } else {
            newcontent = newcontent + content_array[i] + ",";
        }
    }
    return newcontent.substring(0, newcontent.length - 1);
}

//跳转
function jumpToPolicyEditor(user_id) {
    policyname = trimStr($("#modeleditor_content").val()).replace(".json", "");//获取json名
    location.href = "PolicyEditor.html?policy_name=" + policyname + "&user_id=" + user_id;
}

function trimStr(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.endWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substring(this.length - s.length) == s)
        return true;
    else
        return false;
    return true;
}

//从url中获取参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}