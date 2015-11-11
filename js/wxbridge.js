var WxBridge = (function($, wx) {

    //验证签名
    function wx_verif(force,debug){
        var _force = force,_debug = debug;
        var   verif_Url = ['http://wx.wepiao.com','http://yx.wepiao.com','http://weixin.wepiao.com'];
        if(verif_Url.indexOf(window.location.origin) == -1){
            alert("您当前不在微信电影票的认证域名,不能使用分享功能");
            return;
        }
        getcap(_force,_debug);
    }

    function getcap(_force,_debug){
        //alert(window.location.href);
        $.ajax({
            type : "get",
            async:true,
            data:{
                url: window.location.href,
                force:_force
            },
            url : "http://wxtoken.wepiao.com/CreateJsApiTicket.php",
            dataType : "jsonp",
            success : function(res) {
                if(res.ret == 0){
                    var data = res.data;
                    //alert(JSON.stringify(data));
                    //alert(_debug);
                    wx.config({
                        debug: _debug,//如果在测试环境可以设置为true，会在控制台输出分享信息； //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId:data.appId, // 必填，公众号的唯一标识
                        timestamp:data.timestamp , // 必填，生成签名的时间戳
                        nonceStr:data.nonceStr, // 必填，生成签名的随机串
                        signature:data.signature,// 必填
                        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填
                    });

                    if(_force == 1){
                        share(share_param);
                    }

                    wx.error(function(res){
                        //alert(JSON.stringify(res));
                        //签名过期导致验证失败
                        if(res.errMsg != 'config:ok'){//如果签名失效，不读缓存，强制获取新的签名
                            console.log("签名失效");
                            wx_verif(1,false);
                        }
                    });
                }
            },
            error : function() {
                if(_force == 1){
                    share(share_param);
                }
            }
        });
    }

    //分享
    function share(param){
        var _param = {
            title : param.title || '',// 分享标题
            link : param.link || '',// 分享链接
            imgUrl : param.imgUrl || '',// 分享图标
            desc : param.desc || '',// 分享描述,分享给朋友时用
            type : param.type || 'link',// 分享类型,music、video或link，不填默认为link,分享给朋友时用
            dataUrl : param.dataUrl || '', // 如果type是music或video，则要提供数据链接，默认为空,分享给朋友时用
            callback: param.callback || function (){}//分享回调
        };

        //alert(JSON.stringify(_param));
        wx.ready(function(res){
            //	wx.hideAllNonBaseMenuItem();
            //alert('wx ready');
            wx.showOptionMenu({
                menuList: [
                    'menuItem:share:appMessage',
                    'menuItem:share:timeline'
                ]
            });

            //wx.hideMenuItems({
            //    menuList: ['menuItem:copyUrl','menuItem:openWithSafari','menuItem:share:brand'] // 要隐藏的菜单项，所有menu项见附录3
            //});
            //校验分享接口是否可用
            wx.checkJsApi({
                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','hideMenuItems'],
                success: function(res) {
                    if((res.checkResult.onMenuShareTimeline=!!false) || (res.checkResult.onMenuShareAppMessage=!!false)){
                        return false;
                    }
                }
            });
            //分享到朋友圈
            wx.onMenuShareTimeline({
                title : _param.title,
                link : _param.link,
                imgUrl : _param.imgUrl,
                success : function (res) {
                    // 用户确认分享后执行的回调函数
                    _param.callback();

                },
                cancel: function (res) {

                    // 用户取消分享后执行的回调函数
                }
            });
            //分享给朋友
            wx.onMenuShareAppMessage({
                title : _param.title,
                desc : _param.desc,
                link : _param.link,
                imgUrl : _param.imgUrl,
                type : _param.type,
                dataUrl : _param.dataUrl,
                success : function (res) {
                    // 用户确认分享后执行的回调函数
                    _param.callback();


                },
                cancel: function (res) {

                    // 用户取消分享后执行的回调函数
                }
            });
        });
    }

    wx_verif(0, false);

    return {
        auth: wx_verif,
        share: share
    }
}(Zepto, jWeixin));
