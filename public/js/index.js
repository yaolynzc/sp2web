var currentPage = 1;
var nextpage = true;

$(document).ready(function(){
  initList();

  $("#name").keypress(function(e){
    if (e.keyCode == 13) {
      currentPage = 1;
      getList();
    }
  })
  
  $("#btn_search").click(function(){
    currentPage = 1;
    getList();
  });

  $("#btn_newlist").click(function(){
    $("#name").val('');
    currentPage = 1;
    getList();
  });

  $("#prepage").click(function(){
    if(currentPage == 1){
      $("#prepage").parent().removeClass("active").addClass("disabled");
    }else{
      $("#nextpage").parent().removeClass("disabled").addClass("active");
      nextpage = true;
      currentPage--;
      getList();
      if(currentPage == 1){
        $("#prepage").parent().removeClass("active").addClass("disabled");
      }
    }
  });

  $("#nextpage").click(function(){
    if(nextpage){
      $("#prepage").parent().removeClass("disabled").addClass("active");
      currentPage++;
      getList();
    }else{
      return;
    }
  });
});

// 初始化或最新
function initList(){
  var datas = {
    rad:Math.random()
  }
  $.ajax({
    type: "GET",
    url: "/search",
    data: datas,
    success: function (response) {
      // console.log(response.dt);
      if(response.success){
        var data = response.dt;
        for(var i in data){
          // mysql版本
          // var localtime = new Date(data[i].CTIME).format('yyyy-MM-dd hh:mm:ss');
          // var localtime = data[i].CTIME.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
          // var template = '<tr>'
          //              + '<td>' + data[i].NAME + '</td>'
          //              + '<td><a href="/down/' + data[i].ID + '">' + data[i].ID + '</a></td>'
          //              + '<td>' + localtime + '</td>'
          //              + '</tr>';
          // mongodb版本
          var localtime = new Date(data[i].meta.createdAt).format('yyyy-MM-dd hh:mm:ss');
              var template = '<tr>'
              + '<td>' + data[i].name + '</td>'
              + '<td>' + data[i].type + '</td>'
              + '<td>magnet:?xt=urn:btih:' + data[i].infohash + '</td>'
              + '<td>' + localtime + '</td>'
              + '</tr>';
          $("#tdlist").append(template);
        }
        if(response.count < 20){
          $("#nextpage").parent().addClass("disabled");
          nextpage = false;
        }
      }
    }
  });
}

// 搜索
function getList(){
  if(currentPage == 1){
    $("#prepage").parent().removeClass('active').addClass("disabled");
  }
  $("#nextpage").parent().removeClass('disabled').addClass("active");
  nextpage = true;

  var datas = {
    name:$("#name").val(),
    page:currentPage,
    rad:Math.random()
  }
  $.ajax({
    type: "GET",
    url: "/search",
    data: datas,
    success: function (response) {
      // console.log(response.dt);
      if(response.success){
        var data = response.dt;
        $("#tdlist").html('');
        for(var i in data){
          // var localtime = new Date(data[i].CTIME).format('yyyy-MM-dd hh:mm:ss');
          // var localtime = data[i].CTIME.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
          // var template = '<tr>'
          //              + '<td>' + data[i].NAME + '</td>'
          //              + '<td><a href="/down/' + data[i].ID + '">' + data[i].ID + '</a></td>'
          //              + '<td>' + localtime + '</td>'
          //              + '</tr>';
          var localtime = new Date(data[i].meta.createdAt).format('yyyy-MM-dd hh:mm:ss');
              var template = '<tr>'
              + '<td>' + data[i].name + '</td>'
              + '<td>' + data[i].type + '</td>'
              + '<td>magnet:?xt=urn:btih:' + data[i].infohash + '</td>'
              + '<td>' + localtime + '</td>'
              + '</tr>';
          $("#tdlist").append(template);
        }

        if(response.count < 20){
          $("#nextpage").parent().addClass("disabled");
          nextpage = false;
        }
      }
    }
  });
}

// 格式化时间字符串为yyyy-mm-dd hh:mm:sss
Date.prototype.format = function(format) {
  var date = {
         "M+": this.getMonth() + 1,
         "d+": this.getDate(),
         "h+": this.getHours(),
         "m+": this.getMinutes(),
         "s+": this.getSeconds(),
         "q+": Math.floor((this.getMonth() + 3) / 3),
         "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
         format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
         if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                       ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
         }
  }
  return format;
}