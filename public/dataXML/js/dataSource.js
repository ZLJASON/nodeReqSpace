function getNews(opt, callBack) {
  soapGetData({
    dataMethod: "xml",
    url: 'http://mtest.xudc.com:8080/house/ws/articleservice?wsdl',
    methodName: 'getArticleList',
    data: opt,
    namespaceURL: 'http://mtest.xudc.com:8080/house',
    beforeSend: function() {
      showMsg({
        show: true,
        msg: '正在加载...'
      })
    },
    success: function(data) {
      // 关闭消息框
      showMsg({
        show: false
      });
      var _response = data.Body.getArticleListResponse.result;
      callBack && callBack(_response);
    },
    error: function(err) {
      // 关闭消息框
      showMsg({
        show: false
      });
      // 开启提示消息
      showMsg({
        show: true,
        msg: err || '',
        timeOutClose: true
      });
    }
  });
}