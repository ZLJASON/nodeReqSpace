/**
 * Created by lfjt on 2015/9/1.
 */
require.config({
    shim: {
        'easyui': {
            deps: ['jquery'],
            exports:'jQuery.fn'
        },
        'easyuiCN': {
            deps: ['easyui'],
            exports:'jQuery.fn'
        }
    },
    paths: {
        jquery: '../lib/jquery-2.1.3',
        easyui:'../lib/easyui-1.4.3/jquery.easyui.min',
        easyuiCN:'../lib/easyui-1.4.3/locale/easyui-lang-zh_CN',
        handlebars: '../lib/handlebars',
        common: '../common',
        service: '../dataSource'
    }

});
require(["jquery","handlebars","common","service","easyui","easyuiCN"], function($,Handlebars,common,service){

    /*页面初始化*/
    $(function(){
        formatter();
        initPage();
    });

    /*获取销售日报详细信息*/
    function initPage(){
        var _data=common.QueryString("date");
        service.getSaleDaily({
            callFn:getSaleDailyCallFn,
            data:_data
        });
    }

    function getSaleDailyCallFn(data) {
        if (data.result == "success") {
            if (data.type==1) {
                common.updataTemp("content", "type1-template", data.data);
            }else {
                common.updataTemp("content", "type2-template", data.data);
            }
        }else{
            $.messager.show("提示信息","获取数据出错!");
        }
    }


});