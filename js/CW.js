'use strick';
var CW = {
  $num:$(".footer .num"),//点赞数
  $suport:$(".footer .support"),//点赞按钮
  channelId:"3",//渠道id (微信电影票是3)
  activeId:"1",//活动id
  redirectUrl:window.location.href,//调回地址：就是当前页面地址
  /**分享**/
  share:function(){
    var imgUrl = $(".footer .sShare_logo").val();
    var link = $(".footer .sShare_link").val();
    var title = $(".footer .sShare_title").val();
    var desc = $(".footer .sShare_summary").val();
    WxBridge.share({
        'imgUrl' : imgUrl, // 图片地址
        'link' : link, // 链接地址
        'title' : title, // 分享标题
        'desc' : desc // 分享内容
    });
  },
  //授权
  authorization:function(){
    var _this = this;
    $.ajax({
      type:"POST",
      url:"http://promotion.wepiao.com/activecms/login/get-auth-code",
      data:{channelId:_this.channelId,redirectUrl:_this.redirectUrl},
      dataType:"json",
      success:function(data){
        if(data.ret==302&&data.sub==302){
          window.location.href=data.data;//成功跳转回来
        }else{
          alert("网络异常");
        }
      },
      error:function(){}
    });
  },
  //得到code
  getCode:function(){//解析url
    var search= window.location.search;
    var sStr = search.substring(1,search.length);
    var sList = sStr.split("&");
    var code="";
    for(var i=0;i<sList.length;i++){
      var items = sList[i].split("=");
      if(items[0]=="code"){
        code = items[1];
      }
    }
    return code;
  },
  //登录
  login:function(){//拿到code登录种cookie
    var code = this.getCode();
    var _this = this;
    $.ajax({
      type:"POST",
      url:"http://promotion.wepiao.com/activecms/login/login",
      data:{channelId:_this.channelId,code:code},
      dataType:"json",
      success:function(data){
        if(data.ret==0&&data.sub==0){
          //_this.mcryoId = data.data.mcryoId;
          //_this.mcryuId = data.data.mcryuId;
          //后台种cookie
        }else{
          alert("网络异常");
        }
      },
      error:function(){}
    });
  },
  //获取点赞信息
  getFavoriteMsg:function(){
    var _this = this;
    $.ajax({
      type:"POST",
      url:"http://promotion.wepiao.com/activecms/like/get-active-likes",
      data:{channelId:_this.channelId,activeId:_this.activeId},
      dataType:"json",
      success:function(data){
        if(data.ret==0&&data.sub==0){
                                                                                                                                                                             _this.$num.text(data.data.activeId);
        }else{
          alert("网络异常");
        }
      },
      error:function(){}
    });
  },
  //点赞或者取消点赞
  favoriteEvent:function(){
      var _this = this;
      var flag = _this.$suport.hasClass("supported");
      var number = Number(_this.$num.text());
      $.ajax({
        type:"POST",
        url:"/activecms/like/click",
        data:{channelId:_this.channelId,activeId:_this.activeId},
        dataType:"json",
        success:function(data){
          if(data.ret==0&&data.sub==0){
            //点赞成不成功都会先让客户看到成功
          }else{
            alert("网络异常");
          }
        },
        error:function(){}
      });
      if(flag){
        number--;
        if(number<=0){
          number=0;
        }
        _this.$suport.removeClass("supported");
        _this.$num.text(number);
      }else{
        number++;
        _this.$suport.addClass("supported");
        _this.$num.text(number);
      }
  },
  //音频控制
  audioControl:function(){
    var $audio = $("#audioTag")[0];
    var $controlBtn = $(".control");
    var $player = $(".player");
    var $btn = $controlBtn.find(".btn");
    $player.addClass("paused");
    $controlBtn.click(function(){
      if($audio.paused){
        $audio.play();
        $player.removeClass("paused");
        $player.addClass("running");
        $(this).addClass("pause");
      }
      else{
        $audio.pause();
        $player.removeClass("running");
        $player.addClass("paused");
        $(this).removeClass("pause");
      }
    });
  },
  imgOperator:function(){//图片处理
     var imgList = $("img");
     imgList.each(function(){
       $(this).css({"width":"100%","height":"none"});
     });
  },
  getCookie:function (c_name){
　　　　if (document.cookie.length>0){　　//先查询cookie是否为空，为空就return ""
　　　　　　c_start=document.cookie.indexOf(c_name + "=")　　//通过String对象的indexOf()来检查这个cookie是否存在，不存在就为 -1
　　　　　　if (c_start!=-1){
　　　　　　　　c_start=c_start + c_name.length+1　　//最后这个+1其实就是表示"="号啦，这样就获取到了cookie值的开始位置
　　　　　　　　c_end=document.cookie.indexOf(";",c_start)　　//其实我刚看见indexOf()第二个参数的时候猛然有点晕，后来想起来表示指定的开始索引的位置...这句是为了得到值的结束位置。因为需要考虑是否是最后一项，所以通过";"号是否存在来判断
　　　　　　　　if (c_end==-1) c_end=document.cookie.length
　　　　　　　　return unescape(document.cookie.substring(c_start,c_end))　　//通过substring()得到了值。想了解unescape()得先知道escape()是做什么的，都是很重要的基础，想了解的可以搜索下，在文章结尾处也会进行讲解cookie编码细节
　　　　　　}
　　　　}
　　　　return ""
　},
  //初始化
  init:function(){
    var code = this.getCode();
    if(code!=""){
      this.login();
    }else{
      this.authorization();//进入页面先授权
    }
    this.getFav2oriteMsg();//获取点赞信息
    this.audioControl();//音频控制
    this.imgOperator();//图片处理
    this.share();//微信分享配置
  }
};
