/**
 * Created by JASON on 15/9/1.
 */
require.config({
    paths: {
        jquery: '../lib/jquery-2.1.3'
    }
});
define(['jquery'],function ($) {
    var service={
        ip:"http://10.240.15.21:8080/ProjectPlanService"
    };
    function doAjax(opts){
        var defalutOpts = {
            type    : "GET",
            data    : {},
            catche   : true,
            dataType: "JSON",
            progress: true,
            callBack: function(){},
            beforeSend: function(jqXHR, settings){  // 显示处理中状态
                options.progress && $.messager.progress({msg:'处理中...'});
            },
            isShowMsg: false,    // 提示操作提示
            showMsgFunc: function(){}
        }

        var options = $.extend({}, defalutOpts, opts);

        return $.ajax(options).done(function(data, textStatus, jqXHR) {
            Boolean(options._optionType)?options.callBack.call(data,data,options._optionType):options.callBack.call(data,data);
            options.isShowMsg && showMsg.call(data, data, options.showMsgFunc)
        }).fail(function(jqXHR,textStatus,errorThrown) {
                $.messager.alert('错误信息','操作失败!','warning');
        }).always(function(data,textStatus) {
                options.progress && $.messager.progress('close');
        });
    }

    function showMsg(msg,callFn){
        console.dir(msg,callFn.toString());
    }
    service.getSaleDaily=function(options){
        var _opt={
            callBack:options.callFn,
            url:service.ip+"/api/SaleDailyReports/"+options.data
        }
         doAjax(_opt);
    }
    service.getSaleDailyReports=function(options){
        //api/SaleDailyReports/days/2015-08-29_1_10
        var _opt={
            callBack:options.callFn,
            url:service.ip+"/api/SaleDailyReports/days/"+options.data,
            _optionType:options.optionType
        }
        doAjax(_opt);
    }

    return service;
});