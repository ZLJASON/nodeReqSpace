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
        WdatePicker:'../lib/My97DatePicker/WdatePicker',
        IScroll:'../lib/iscroll',
        common: '../common',
        service: '../dataSource'
    }

});
require(["jquery","WdatePicker","IScroll","common","service","easyui","easyuiCN"], function($,WdatePicker,IScroll,common,service){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    $(function(){
        initPage();
    });

    function initPage(){
        /*初始化格式化*/
        formatter();
        /*初始化滚动*/
        listScroll();
        /*绑定监听*/
        $("#queryBtn").click(searchData);
    }

    /*上下滚动*/
    var myScroll,IScroll,Page,devDate,listData=[];
    function listScroll () {
        var IScroll=window.IScroll;
        devDate=new Date().Format("yyyy-MM-dd");
        Page={
            pageNum:1,
            pageSize:10
        }
        myScroll = new IScroll('#wrapper', {
            scrollbars: true,
            mouseWheel: true,
            click: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true
        });
        service.getSaleDailyReports({
            data:devDate+common.getPageQuery(Page),
            callFn:getSaleDailyReportsCallF
        });
        //下拉加载
        myScroll.on('scrollEnd', requestData);
    }
    /*下拉到底部的回调方法*/
    function requestData () {
        if(myScroll.maxScrollY==myScroll.y){
            Page.pageNum=Page.pageNum+1;
            service.getSaleDailyReports({
                data:devDate+common.getPageQuery(Page),
                callFn:getSaleDailyReportsCallF
            })
        }
    }
    /*获取列表数据*/
    function getSaleDailyReportsCallF(data,type){
        typeof type != "undefined"?listData=data:listData=listData.concat(data);
        common.updataTemp("scroller","list-template",listData);
        myScroll. refresh();
    }
    /*查询方法*/
    function searchData(){
        var _yV=$("#queryYData").val();
        var _mV=$("#queryMData").val();
        var _dV=$("#queryDData").val();
        if(_yV==""){
            $.messager.alert("提示信息","请选择年");
            return;
        }
        if(_mV==""){
            $.messager.alert("提示信息","请选择月");
            return;
        }
        if(_dV==""){
            $.messager.alert("提示信息","请选择日");
            return;
        }
        devDate=_yV.substring(0,_yV.length-1)+"-"+_mV.substring(0,_mV.length-1)+"-"+_dV.substring(0,_dV.length-1);
        service.getSaleDailyReports({
            data:devDate+common.getPageQuery(Page),
            callFn:getSaleDailyReportsCallF,
            optionType:1
        });
    }

    window.getDevDate=function(){
        var result="";
        result=console.log($("#queryYData").val(),$("#queryMData").val(),$("#queryDData").val());
        return result;
    }
});