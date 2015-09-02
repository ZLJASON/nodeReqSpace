/*
 * options:{
 *     url:
 *     method:
 *     data://请求数据
 *     beforeSend:请求前方法
 *     success:成功回调方法
 *     error:失败方法
 *     dataMethod:json,xml。默认为json
 * }
 */
function soapGetData(options) {
    if (options.dataMethod && options.dataMethod == "xml") {
        /*XML交互方式*/
        $.soap({
            url: options.url || '',
            method: options.methodName,
            data: options.data,
            prefix: false,
            namespaceQualifier: '',
            namespaceURL: 'http://mtest.xudc.com:8080/house',
            beforeSend: function(SOAPEnvelope) {
                options.beforeSend && options.beforeSend();
            },
            success: function(soapResponse) {
                var _data = soapResponse.toJSON();
                options.success && options.success(_data);
            },
            error: function(SOAPResponse) {
                options.error && options.error();
            }
        });
    } else {
        $.ajax({
            url: options.url || '',
            type: options.type,
            dataType: 'json',
            beforeSend: function() {
                options.beforeSend && options.beforeSend();
            },
            success: function(data) {
                options.success && options.success(data);
            },
            error: function(SOAPResponse) {
                options.error && options.error();
            }
        });
    }
}


/*
  显示消息
  opt{
    timeOutClose // 延迟关闭
    msg: 消息
    show: 显示还是隐藏
  }
 */
function showMsg(opt) {
    var msgDom = $("#msgDom");
    if (opt.show) {
        msgDom.removeClass("flipOutX").addClass("flipInX").show().html('<div class="msgCont">' + opt.msg + '</div>');
    } else {
        msgDom.removeClass("flipInX").addClass("flipOutX")
        setTimeout(function() {
            msgDom.hide();
        }, 200);
    }


    if (opt.timeOutClose) {
        opt.show = false,
            opt.timeOutClose = null;
        showMsg(opt);
    }
}

/*
  模板渲染
  id:模板的id
  data:模板的数据
 */
function tempFn(opt) {
    var _source = $("#" + opt.id).html();
    var _template = Handlebars.compile(_source);
    var _result = "";
    _result = _template(opt.data);
    return _result;
}

/*初始化Tab*/
function initTab(tabText) {
    var swiper = new Swiper('.tab-container', {
        pagination: '.lf-tab-indexCont',
        paginationClickable: true,
        paginationBulletRender: function(index, className) {
            return '<span class="' + className + ' lf-tab-indexItem">' + tabText[index] + '</span>';
        }
    });
    return swiper;
}