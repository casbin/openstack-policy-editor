//Changed By HongboZhou 2017.1.26
var i18nLang = {};//从里面移出来，方便另一个函数调用
(function ($) {
    $.fn.extend({
        i18n: function (options) {
            var defaults = {
                lang: "",
                defaultLang: "",
                filePath: "/i18n/",
                filePrefix: "i18n_",
                fileSuffix: "",
                forever: false,
                callback: function () {
                }
            };

            var options = $.extend(defaults, options);
            options.lang = defaults.defaultLang;



            var i = this;
            $.getJSON(options.filePath + options.filePrefix + options.lang + options.fileSuffix + ".json", function (data) {

                if (data != null) {
                    i18nLang = data;
                }

                $(i).each(function (i) {
                    var i18nOnly = $(this).attr("i18n-only");
                    if ($(this).val() != null) {
                        if (i18nOnly == null || i18nOnly == undefined || i18nOnly == "" || i18nOnly == "value") {
                            $(this).val(i18nLang[$(this).attr("i18n")])
                        }
                    }
                    if ($(this).html() != null) {
                        if (i18nOnly == null || i18nOnly == undefined || i18nOnly == "" || i18nOnly == "html") {
                            $(this).html(i18nLang[$(this).attr("i18n")])
                        }
                    }
                    if ($(this).attr('placeholder') != null) {
                        if (i18nOnly == null || i18nOnly == undefined || i18nOnly == "" || i18nOnly == "placeholder") {
                            $(this).attr('placeholder', i18nLang[$(this).attr("i18n")])
                        }
                    }
                });
                options.callback();
            });
        },

    });

    //以下是鸿博新增的 见http://www.jb51.net/article/45801.htm
    $.i18nGet = function (key) {
        if (i18nLang != {}) {
            if (i18nLang.hasOwnProperty(key))
                return i18nLang[key];
            else
                throw new Error("Key not exist");
        }
        else
            throw new Error("Call i18n(option) first");
    };
})(jQuery);