(function () {
	var Api = {};
	Api.ready = function(callback) {
		Api._ready ? callback() : wx.ready(callback);
	};
	wx.ready(function() {
		Api._ready = true;
	});
	Api.init = function(_config) {
		var config = {
			debug: false,
			jsApiList: [
				'checkJsApi',
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'onMenuShareQQ',
				'onMenuShareWeibo',
				'hideMenuItems',
				'showMenuItems',
				'hideAllNonBaseMenuItem',
				'showAllNonBaseMenuItem',
				'translateVoice',
				'startRecord',
				'stopRecord',
				'onRecordEnd',
				'playVoice',
				'pauseVoice',
				'stopVoice',
				'uploadVoice',
				'downloadVoice',
				'chooseImage',
				'previewImage',
				'uploadImage',
				'downloadImage',
				'getNetworkType',
				'openLocation',
				'getLocation',
				'hideOptionMenu',
				'showOptionMenu',
				'closeWindow',
				'scanQRCode',
				'chooseWXPay',
				'openProductSpecificView',
				'addCard',
				'chooseCard',
				'openCard'
			]
		};
		$.extend(config, _config||{});
		// alert(window.location.href);
		// console.log(window.location);
		// alert(window.location.href.split('?')[0]);

		if(window.location.host == 'project.starfruit.net.cn'|| window.location.host == 'project.starfruit.net.cn:8080'){

			$.ajax({  
				type : "GET",
				dataType: 'jsonp',
				data:{
					url:window.location.href
				},
				url : "http://project.starfruit.net.cn/formtest/wechatparamsjsonp.php",
				success : function(data_) {  

					config.appId = data_.appId;
					config.timestamp = data_.timestamp;
					config.nonceStr = data_.nonceStr;
					config.signature = data_.signature;
					
					wx.config(config);
					// console.log('project::',data_);

				},  
				error : function() {  
					console.log('error');
				}  
			}); 

		}else{

			$.ajax({  
				type : "GET",  
				async:true,
				data:{
					url:window.location.href,
					force:0
				},
				url : "http://182.254.230.26:8080/CreateJsApiTicket.php",
				dataType : "jsonp",  
				success : function(res) {  

					var data = res.data;
					config.appId = data.appId;
					config.timestamp = data.timestamp;
					config.nonceStr = data.nonceStr;
					config.signature = data.signature;
					config.rawString = data.rawString;

					wx.config(config);
					// console.log('wepiao::',data);

				},  
				error : function() {  
					
				}  
			}); 
			
		}

	};

	Api.share = function(data, reverse) {
		Api.ready(function() {
			wx.onMenuShareTimeline(data);
			if (reverse) data = $.extend({}, data, {title: data.friend, desc: data.desc});
			wx.onMenuShareAppMessage(data);
			wx.onMenuShareQQ(data);
			wx.onMenuShareWeibo(data);
		});
	};
	Api.shareTimeline = function(data) {
		Api.ready(function() {
			wx.onMenuShareTimeline(data);
		});
	};
	Api.shareAppMessage = function(data, reverse) {
		data = $.extend({}, data, {title: data.friend, desc: data.desc});
		Api.ready(function() {
			wx.onMenuShareAppMessage(data);
		});
	};
	Api.shareQQ = function(data) {
		Api.ready(function() {
			wx.onMenuShareQQ(data);
		});
	};
	Api.shareWeibo = function(data) {
		Api.ready(function() {
			wx.onMenuShareWeibo(data);
		});
	};

	window.WeixinApi = Api;
})();
