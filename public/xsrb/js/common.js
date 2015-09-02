/**
 * Created by JASON on 15/9/1.
 */
require.config({
    paths: {
        jquery: '../lib/jquery-2.1.3',
        handlebars: '../lib/handlebars'
    }
});
define(['jquery','handlebars'],function ($,Handlebars) {
    var common={};

    /*从URL上取参数*/
    common.QueryString=function (val){
        var uri = window.location.search;
        var re = new RegExp("" +val+ "=([^&?]*)", "ig");
        return ((uri.match(re))?decodeURIComponent(uri.match(re)[0].substr(val.length+1)):null);
    }




    common.getPageQuery=function(page){
        var result="_";
        return result+page.pageNum+"_"+page.pageSize;
    }

    /*格式化Date*/
    Date.prototype.Format =function(fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    /*跳转到内容页*/
    window.jumpPage=function(url){
        window.location.href=url;
    }

    /*格式化后台返回数据*/
    window.formatter=function(){
        Handlebars.registerHelper('titleDateF', function(value) {
            var result="",_temp=value.split("-");
            if(value==""){
                return ""
            }
            result=_temp[0]+"年"+_temp[1]+"月"+_temp[2]+"日销售日报";
            return result;
        });

        Handlebars.registerHelper("isEmptyArray",function(value,options){
            if(value.length!=0){
                //满足添加继续执行
                return options.fn(this);
            }else{
                //不满足条件执行{{else}}部分
                return options.inverse(this);
            }
        });
    }

    common.updataTemp=function(contentId,tempId,data){
        var _template = Handlebars.compile($("#"+tempId).html());
        $("#"+contentId).html(_template(data));
    }
    return common;
});

