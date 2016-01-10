'use strick';
var FX = {
  limit:5,
  start:0,
  data:null,
  length:0,
  Scroll:"",
  isRenderList:true,
  swiper:function(){//轮播图
      var swiper = new Swiper('.swiper-container', {
           autoplay: 2000,
           loop:true,
           pagination: '.swiper-pagination',
           autoplayDisableOnInteraction:false,
           paginationClickable: true
      });
  },
  getPage:function(data){
    console.log("getpage......");
    console.log(data);
    var list = data.info;
    var _this = this;
    if(list.length<=0){
      $(".loadMore").addClass("loadEnd").unbind("click").html("");
      myScroll.refresh();
    }else{
       for(var i=0;i<list.length;i++){
          var isNew = false;
          var date = new Date(list[i].onlineTime*1000);
          var today = new Date().getTime();
          if((today-date)<86400000){
            isNew = true;
          }
          var str =  "";
            if(i==0){
              str += "<div class=\"item firstItem\">";
            }else{
              str += "<div class=\"item\">";
            }

              str += "  <a href=\""+list[i].url+"\">";
              str += "    <div class=\"img\">";
              str += "      <img src=\""+list[i].cover+"\" />";
              if(list[i].type==2){
                str += "      <i class=\"movieIcon\"></i>";
              }
              str += "    <\/div>";
              str += "    <div class=\"msg\">";
              str += "      <div class=\"tm\">";
              str += list[i].title;
              if(isNew){
                str += "        <span class=\"tip\">new<\/span>";
              }
              str += "      <\/div> ";
              str += "      <div class=\"bm\">";
              str += "        <span class=\"tit\">"+list[i].tag+"<\/span>";
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
          myScroll.refresh();
        }
        myScroll.refresh();
        this.start = this.start+list.length;
        if($(".cmsList .listCon .item").length>=data.totalNum){
          $(".loadMore").addClass("loadEnd").unbind("click").html("");
          myScroll.refresh();
        }
    }

    myScroll.refresh();

  },
  getCMList:function(){//内容列表
        var _this = this;
        _this.requireCmsData(_this.start,_this.limit);
        $(".loadMore").click(function(){
          _this.requireCmsData(_this.start,_this.limit+5);
          //myScroll.refresh();
          myScroll.on('scrollEnd', function(){
            console.log(this.y);
            console.log(this.maxScrollY);
            if(this.y>=(this.maxScrollY)){
              if(_this.isRenderList){
                _this.requireCmsData(_this.start,_this.limit);
              }
            }

          });
        });

  },
  requireCmsData:function(start,limit){
    this.isRenderList=false;
    var url = "http://promotion.wepiao.com/activecms/active-list/get-active-list?channelId=3&&city=10&&start="+start+"&limit="+limit+"&jsonp=?";
    var _this = this;
    $.getJSON(url,function(data){
         if($(".cmsList .listCon .item").length>=data.info)return;
         if(data.ret==0&&data.sub==0){
            var list = data.data;
            _this.data = list;
            _this.getPage(_this.data);
            _this.isRenderList=true;
         }
    });
  },
  renderHead:function(data){
    for(var i=0;i<1;i++){
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
        myScroll.refresh();
    }
  },
  getHeadList:function(){//得到headlist
    var _this = this;
     $.ajax({
        url : 'http://appnfs.wepiao.com/uploads/weixin_discovery_head/head.json?='+new Date().getTime(),  //线上
        type: 'GET',
        dataType: 'jsonp',
        jsonpCallback: 'callbackhead',
        success: function(data, status, xhr) {
            var data = data[0].data;

            var today = new Date().getTime();
            var type1 = new Array(),type2 = new Array(),type3 = new Array();

            for(var i=0;i<data.length;i++){
              var temp = data[i];
              var iHideAt = temp.iHideAt*1000;
              var iShowAt = temp.iShowAt*1000;
              if(temp.iType==1){
                if(today>iShowAt&&today<iHideAt){
                  type1.push(temp);
                }else{
                  type1.push(temp);
                }
              }
              if(temp.iType==2){
                if(today>iShowAt&&today<iHideAt){
                  type2.push(temp);
                }else{
                  type2.push(temp);
                }
              }
              if(temp.iType==3){
                if(today>iShowAt&&today<iHideAt){
                  type3.push(temp);
                }else{
                  type3.push(temp);
                }
              }
            }
            _this.renderHead(type1);
            _this.renderHead(type2);
            _this.renderHead(type3);
            myScroll.refresh();
        },
        error: function() {
            console.log('not good');
        }
    });
  },
  getBannerList:function(){
    var _this = this;
    var url = "http://appnfs.wepiao.com/uploads/weixin_banner/banner.json?="+new Date().getTime();
    //var url = "http://wxadmin.pre.wepiao.com/uploads/weixin_banner/banner.json?="+new Date().getTime();
    $.ajax({
        url : url,
        type: 'GET',
        dataType: 'jsonp',
        jsonpCallback: 'callback_banner',
        success: function(data, status, xhr) {
            var activeData = [];
            if(data["10"]!=undefined){
              activeData = data["10"].data;
            }
            var allData = data["0"].data;
            var data = activeData.concat(allData);
            console.log(data);
            data.sort(function(a,b){
              return a.iSort<b.iSort?1:-1;
            });
            console.log("==============================");
            console.log(data);
            var today = new Date().getTime();
            for(var i=0;i<data.length;i++){
              var hideAt = data[i].hide_at*1000;
              var showAt = data[i].show_at*1000;
              //console.log("time............");
              console.log(today+"====="+hideAt+"========"+showAt);
              if(today>showAt&&today<hideAt){
                var imgUrl = data[i].img;
                var str  = "<div class=\"swiper-slide\">";
                    str += "<a href=\""+data[i].url+"\">";
                    str += "<img src=\""+imgUrl+"\" \/>";
                    str += "<\/a>";
                    str += "<\/div>";
                $(".swiper-wrapper").append(str);
                myScroll.refresh();
              }
            }
            if($(".swiper-wrapper").find(".swiper-slide").length>1){
              _this.swiper();
            }

            $(".swiper-pagination").show();
            myScroll.refresh();
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
    //this.Scroll = new IScroll('#fxCon', {preventDefault: false,probeType: 3,mouseWheel: true })
    this.getCMList();
    this.getHeadList();
    this.getBannerList();
    this.entranceGo();
     setTimeout(function(){
       myScroll.refresh();
     },1000);
  }
};
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
//ga('create', 'UA-58583546-1', { 'userId': 'USER_ID' });
ga('create', 'UA-66290672-1', 'auto');
ga('send', 'pageview');
$(function(){
  FX.init();
});
