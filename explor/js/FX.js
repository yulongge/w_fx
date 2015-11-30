'use strick';
var FX = {
  num:5,
  startNum:0,
  data:null,
  swiper:function(){//轮播图
      var swiper = new Swiper('.swiper-container', {
           autoplay: 2000,
           loop:true,
           pagination: '.swiper-pagination',
           autoplayDisableOnInteraction:false,
           paginationClickable: true
      });
  },
  getPage:function(data,start,num){
    var list = data;
    var _this = this;
    for(var i=_this.startNum;i<(_this.startNum+_this.num);i++){
      var isNew = false;
      var date = new Date(list[i].updateTime*1000);
      var today = new Date().getTime();
      if((today-date)<86400000){
        isNew = true;
      }
      var str =  "<div class=\"item\">";
          str += "  <a href=\""+list[i].url+"?activeId=\""+list[i].activeId+"\"\">";
          str += "    <div class=\"img\">";
          str += "      <img src=\""+list[i].cover+"\" />";
          str += "    <\/div>";
          str += "    <div class=\"msg\">";
          str += "      <div class=\"tm\">";
          str += list[i].summary;
          if(isNew){
            str += "        <span class=\"tip\">new<\/span>";
          }
          str += "      <\/div> ";
          str += "      <div class=\"bm\">";
          str += "        <span class=\"tit\">"+list[i].tag+"<\/span>";
          //str += "        <span class=\"date\">"+(date.getMonth()+1)+"-"+date.getDate()+"<\/span>";
          // if(isNew){
          //   str += "        <span class=\"tip\">new<\/span>";
          // }
          str += "        <span class=\"favor\">";
          str += "            <i class=\"rIcon\"></i>";
          str += "            <i class=\"rNum\">"+list[i].readNum+"</i>";
          if(list[i].like==1){
            str += "          <i class=\"icon selected\"><\/i>";
          }else{
            str += "          <i class=\"icon\"><\/i>";
          }
          
          str += "          <i class=\"num\">"+list[i].likeNum+"<\/i>";
          str += "        <\/span>";
          str += "      <\/div>";
          str += "    <\/div>";
          str += "   <\/a>";
          str += "<\/div>";
      $(".cmsList .listCon").append(str);
    }
    this.startNum = this.startNum+this.num;
  },
  getCMList:function(){//内容列表
        var url = "http://promotion.wepiao.com/activecms/active-list/get-active-list?channelId=3&activeId=1&city=10&jsonp=?";
        var _this = this;
        $.getJSON(url,function(data){
             if(data.ret==0&&data.sub==0){
                var list = data.data;
                _this.data = list;
                _this.getPage(_this.data,_this.startNum,_this.num);

             }
        });
        $(".loadMore").click(function(){
          _this.getPage(_this.data,_this.startNum,_this.num);
        });
  },
  getHeadList:function(){//得到headlist
     $.ajax({
        url : 'http://appnfs.wepiao.com/uploads/weixin_discovery_head/head.json?='+new Date().getTime(),  //线上
        type: 'GET',
        dataType: 'jsonp',
        jsonpCallback: 'callbackhead',
        success: function(data, status, xhr) {
            var data = data[0].data;
            for(var i=0;i<3;i++){
                var str  = "  <div class=\"item\">";
                    str += "    <div class=\"itemCon\">";
                    str += "        <img src=\""+data[i].sPicture+"\"/>";
                    str += "        <div class=\"msg\">";
                    str += "          <a href=\""+data[i].sLink+"\" class=\"linkTo"+(i+1)+"\">";
                    str += "            <span>";
                    str += "              <i class=\"name\">"+data[i].sSecondTitle+"<\/i>";
                    str += "              <i class=\"price\">优惠购票"+data[i].sTitle+"<\/i>";
                    str += "            <\/span>";
                    str += "          <\/a>";
                    str += "        <\/div>";
                    str += "        <div class=\"msg shade\">";
                    
                    str += "        <\/div>";
                    str += "    <\/div>";
                    str += "  <\/div>";
                $(".hotsList").append(str);
            }
            
        },
        error: function() {
            console.log('not good');
            // dfd.reject({
            //     error: 0,
            //     msg: 'json not found'
            // });
        }
    });
  },
  getBannerList:function(){
    var _this = this;
    var url = "http://test.wxadmin.wepiao.com/uploads/weixin_banner/banner.json?="+new Date().getTime();
    $.ajax({
        url : url,
        type: 'GET',
        dataType: 'jsonp',
        jsonpCallback: 'callback_banner',
        success: function(data, status, xhr) {
            var activeData = data["10"].data;
            var allData = data["0"].data;
            var data = activeData.concat(allData);
            console.log(data);
            for(var i=0;i<data.length;i++){
              var imgUrl = data[i].img;
              var index = imgUrl.indexOf("com");
              var tempUrl = imgUrl.substring(index,imgUrl.length);
              var url = "http://test.wxadmin.wepiao."+tempUrl;
              console.log(url);
              var str  = "<div class=\"swiper-slide\">";
                  str += "<a href=\""+data[i].url+"\">";
                  str += "<img src=\""+url+"\" \/>";
                  str += "<\/a>";
                  str += "<\/div>";
              $(".swiper-wrapper").append(str);
            } 
            _this.swiper();
        },
        error: function() {
            console.log('not good');
        }
    });
  },
  entranceGo:function(){
      $('body').on('click','.entrance .item1', function(e){
          e.preventDefault();
          if(e.stopPropagation){
              e.stopPropagation();
          }
          if( ga ){
              ga('send', 'event', '发现固定入口', '打开', '发现-实时票房');
          }
          window.location.href = 'http://piaofang.wepiao.com/?from=discovery';
      });
      $('body').on('click','.entrance .item2', function(e){
          e.preventDefault();
          if(e.stopPropagation){
              e.stopPropagation();
          }
          if( ga ){
              ga('send', 'event', '发现固定入口', '打开', '发现-衍生品商城');
          }
          window.location.href = 'http://wap.koudaitong.com/v2/showcase/homepage?kdt_id=1704229&from=kdt&kdtfrom=&spm=sc2142496';
      });
      $('body').on('click','.entrance .item3', function(e){
          if(e.stopPropagation){
              e.stopPropagation();
          }
          if( ga ){
              ga('send', 'event', '发现固定入口', '打开', '发现-团体采购');
          }
          window.location.href = 'http://b.wepiao.com/jicai/index.html?fid=10003003';
      });
      $('body').on('click','.fxCon .hotsList .item .linkTo1', function(e){
          if(e.preventDefault){
              e.preventDefault();
          }
          if(e.stopPropagation){
              e.stopPropagation();
          }
          if( ga ){
              ga('send', 'event', '发现运营位', '打开', '运营位入口1');
          }
          window.location.href = $(e.currentTarget).attr('href');
      });
      $('body').on('click','.fxCon .hotsList .item .linkTo2', function(e){
          if(e.preventDefault){
              e.preventDefault();
          }
          if(e.stopPropagation){
              e.stopPropagation();
          }
          if( ga ){
              ga('send', 'event', '发现运营位', '打开', '运营位入口2');
          }
          window.location.href = $(e.currentTarget).attr('href');
      });
      $('body').on('click','.fxCon .hotsList .item .linkTo3', function(e){
          if(e.preventDefault){
              e.preventDefault();
          }
          if(e.stopPropagation){
              e.stopPropagation();
          }
          if( ga ){
              ga('send', 'event', '发现运营位', '打开', '运营位入口3');
          }
          window.location.href = $(e.currentTarget).attr('href');
      });
  },
  init:function(){
    //this.swiper();
    this.getCMList();
    this.getHeadList();
    this.getBannerList();
    this.entranceGo();
  }
};
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
//ga('create', 'UA-58583546-1', { 'userId': 'USER_ID' });
ga('create', 'UA-58583546-1', 'auto');
ga('send', 'pageview');
$(function(){
  FX.init();
});