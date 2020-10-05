var resumeId = -1
var projectId = -1
var interviewId = -1

$(document).ready(function () {
    resumeId = $('#resumeInfo').attr('resumeId')
    projectId = localStorage.getItem("test_box_useprojectid")//$('#resumeInfo').attr('projectId')
    interviewId = localStorage.getItem("interview_selected_value")//$('#resumeInfo').attr('interviewId')
    console.log("basicInfo resumeId(",
        resumeId, ") projectId(",
        projectId, ") interviewId(",
        interviewId, ")")

});

var now_interview_status = localStorage.getItem("now_interview_status");
var btnMap = {
    1: `
    <button class="layui-btn layui-btn layui-btn-xs" id="btn11">通过</button>
        <button class="layui-btn layui-btn layui-btn-xs" id="btn12">结束</button>
    `,

    2: `
                    <button class="layui-btn layui-btn layui-btn-xs" id="btn21">微信联系</button>
                    <button class="layui-btn layui-btn layui-btn-xs" id="agreeInterviewButton">同意面试</button>
                   <button class="layui-btn layui-btn layui-btn-xs" id="giveupInterviewButton">放弃面试</button>

        `,
    3:
        `
        <button class="layui-btn layui-btn layui-btn-xs" id="btn32">面试通过</button>
        <button class="layui-btn layui-btn layui-btn-xs" id="giveupInterviewButton">放弃面试</button>
        <button class="layui-btn layui-btn layui-btn-xs" id="agreeInterviewButton">再次面试</button>


        `,
    4:
        `
                        <button class="layui-btn layui-btn layui-btn-xs" id="btn41">待定</button>
                <button class="layui-btn layui-btn layui-btn-xs" id="btn42">同意入职</button>
                <button class="layui-btn layui-btn layui-btn-xs" id="giveupInterviewButton">放弃入职</button>

        `,

    5: `
        <button class="layui-btn layui-btn layui-btn-xs" id="btn51">更期入职</button>
    <button class="layui-btn layui-btn layui-btn-xs" id="btn52">已入职</button>
    <button class="layui-btn layui-btn layui-btn-xs" id="giveupInterviewButton">放弃入职</button>
    `,
    6: `
   
        <button class="layui-btn layui-btn layui-btn-xs" id="giveupInterviewButton">放弃考察</button>
    <button class="layui-btn layui-btn layui-btn-xs" id="btn61">通过考察</button>
    <button class="layui-btn layui-btn layui-btn-xs" id="btn62">未通过考察</button>

    
    `,
}

var baseBtn = '<button class="layui-btn layui-btn layui-btn-xs" id="telPhone">拨打电话</button>'
var rollbackBtn = '<button class="layui-btn layui-btn layui-btn-xs" id="commonRollback">回退</button>'
var weilianxishangBtn = '<button class="layui-btn layui-btn layui-btn-xs" id="weilianxishang">未联系上</button>'
var haomacuowuBtn = '<button class="layui-btn layui-btn layui-btn-xs" id="haomacuowu">号码错误</button>'

if (now_interview_status == 1) {
    $('#shadow').html(baseBtn + btnMap[now_interview_status] + weilianxishangBtn + haomacuowuBtn)
} else {
    $('#shadow').html(baseBtn + btnMap[now_interview_status] + rollbackBtn + weilianxishangBtn + haomacuowuBtn)

}













$(document).on('click', '#deepContactButton', function () {
    var status = 2;
    submitInterviewById(interviewId, "/api/interviews/", status, '深度沟通');
});

$(document).on('click', '#unlinkButton', function () {
    var status = 2;
    submitInterviewById(interviewId, "/api/interviews/", status, '未接通');
});



$('#telPhone').click(function () {
    var phone_number = $('#userBasicEditPhone').val();//$(this).attr('phone_number');
    console.log('phone_number' , phone_number)
    if (!phone_number || phone_number.length != 11 || typeof phone_number === 'undefined') {
        layer.msg('手机号格式错误,拨号失败');
        return false
    }
    var cache_username = localStorage.getItem("cache_username");
    var cache_password = localStorage.getItem("cache_password");
    cache_username = cache_username || '';
    cache_password = cache_password || '';


    var telIdx = layer.open({
        type: 1,
        // closeBtn: 1,
        skin: 'layui-layer-rim', //加上边框
        area: ['250px', '250'], //宽高
        content: `<form class="layui-form" action="">
  <div style="
    padding-left: 40px;
" class="layui-form-item">
    <label class="layui-form-label">账号</label>
    <div class="layui-input-inline">
      <input id="tel_name" type="text" name="text" required  lay-verify="required" value="${cache_username}" placeholder="" autocomplete="off" class="layui-input">
      <input id="phone_number" value="${phone_number}" style="display: none;"/>
    </div>
  </div>
  <div style="
    padding-left: 40px;
" class="layui-form-item">
    <label class="layui-form-label">密码</label>
    <div class="layui-input-inline">
      <input id="tel_password" type="text" name="text" required lay-verify="required"  value="${cache_password}" placeholder="" autocomplete="off" class="layui-input">
    </div>
  </div>


  <br/>
  <div style="margin-top: 10px;margin-left: 70px" class="layui-form-item">
    <label class="layui-form-label"></label>
    <div class="layui-input-inline">
        <button style="text-align: center" id="commitMsg" type="button" class="layui-btn layui-btn-normal">立即呼叫</button>
  </div>
  <script>

var isopen = false;

$(document).on('click', '#commitMsg', function () {
    if(isopen){
        return false;
    }
    isopen = true;
    var tiped = false;
    var tel_name = $('#tel_name').val();
    var tel_password = $('#tel_password').val();
    if (tel_name == '') {
        layer.msg('账号不能为空');
        return false;
    }
    if (tel_password == '') {
          layer.msg('密码不能为空');
          return false;
    }

    var pn = $('#phone_number').val();

    localStorage.setItem("cache_username",tel_name);
        localStorage.setItem("cache_password",tel_password);


    var websocket = null;

        //判断当前浏览器是否支持WebSocket
        if ('WebSocket' in window) {
          websocket = new WebSocket("ws://120.79.141.14:17115/yuntel");
        } else {
          alert('当前浏览器不支持拨号，请换浏览器后再试')
        }

        //连接发生错误的回调方法
        websocket.onerror = function () {
          setMessageInnerHTML("WebSocket连接发生错误");
        };

        //连接成功建立的回调方法
        websocket.onopen = function () {
          setMessageInnerHTML("WebSocket连接成功");
          //login
          send({"messageType": "clientLoginIn", "data": {"username": tel_name, "password": tel_password}})
        }

        //接收到消息的回调方法
        websocket.onmessage = function (event) {
          console.log('接收到消息');
          setMessageInnerHTML(event.data);
          var data = JSON.parse(event.data);
          console.log('data:', data)
          switch (data.messageType) {
            case "clientLoginIn":
              if (data.errcode != 0) {
                layer.msg(data.errmsg);
                return false;
              }

              //直接拨号
              console.log('拨号中');
              send({"messageType": "phoneCall", "data": {"phone": pn}})
              layer.msg('拨号成功')
              break;
            case "phoneInfo":
                if(!tiped){
                                  layer.msg('呼出成功');
                                  tiped = true;
                }

              break;

            default:


          }

        }



        //连接关闭的回调方法
        websocket.onclose = function () {
          setMessageInnerHTML("WebSocket连接关闭");
        }

        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function () {
          closeWebSocket();
        }

        //将消息显示在网页上
        function setMessageInnerHTML(innerHTML) {
          console.log(innerHTML)
        }

        //关闭WebSocket连接
        function closeWebSocket() {
          websocket.close();
        }

        //发送消息
        function send(message) {
          websocket.send(JSON.stringify(message));
        }
        
        setTimeout(function() {
          layer.closeAll()
        },1000)
     

});


</script>`,


    })

})


var dightCnt = 0;


// stage_two_pass

//同意面试
$(document).on('click', '#agreeInterviewButton', function () {



    //简单处理弹出两次弹出两次的情况
    dightCnt++;
    if (dightCnt % 2 === 0) {
        return false;
    }
    console.log('调用父窗口' , interviewId)
      window.parent.stage_two_pass(resumeId,interviewId);
    return false;


    //获得下周一的日期

    function getTime(n) {
        var now = new Date();
        var year = now.getFullYear();
        //因为月份是从0开始的,所以获取这个月的月份数要加1才行
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var day = now.getDay();
        console.log(date);
        //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
        if (day !== 0) {
            n = n + (day - 1);
        } else {
            n = n + day;
        }
        if (day) {
            //这个判断是为了解决跨年的问题
            if (month > 1) {
                month = month;
            }
            //这个判断是为了解决跨年的问题,月份是从0开始的
            else {
                year = year - 1;
                month = 12;
            }
        }
        now.setDate(now.getDate() - n);
        year = now.getFullYear();
        month = now.getMonth() + 1;
        date = now.getDate();
        // console.log(n);
        var s = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
        console.log(now);
        return s;
    }


    var nweekDay1 = getTime(-0);
    var nweekDay2 = getTime(-1);
    var nweekDay3 = getTime(-2);
    var nweekDay4 = getTime(-3);
    var nweekDay5 = getTime(-4);


    var weekDay1 = getTime(-7);
    var weekDay2 = getTime(-8);
    var weekDay3 = getTime(-9);
    var weekDay4 = getTime(-10);
    var weekDay5 = getTime(-11);

    console.log('layer.open');

    //加载初始数据
    var resume_info = JSON.parse(localStorage.getItem('resume_info'));
    var project_info = JSON.parse(localStorage.getItem('project_info'));


    var name = resume_info.username;
    var hr_name = project_info.link.substring(0, project_info.link.indexOf('('));
    var hr_tel = project_info.link.substring(project_info.link.indexOf('(') + 1, project_info.link.indexOf(')'));
    var hr_place = project_info.place;


    //确认框发短信
    layer.open({
        type: 1,
        // closeBtn: 1,
        skin: 'layui-layer-rim', //加上边框
        area: ['440px', '520px'], //宽高
        content: `<form class="layui-form" action="">
  <div class="layui-form-item">
    <label class="layui-form-label">姓名</label>
    <div class="layui-input-inline">
      <input type="text" name="text" required  lay-verify="required" disabled value="${name}" placeholder="" autocomplete="off" class="layui-input">
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">面试官</label>
    <div class="layui-input-inline">
      <input type="text" name="text" required lay-verify="required" disabled  value="${hr_name}" placeholder="" autocomplete="off" class="layui-input">
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">联系方式</label>
    <div class="layui-input-inline">
      <input type="text" name="text" required lay-verify="required" disabled value="${hr_tel}" placeholder="" autocomplete="off" class="layui-input">
    </div>
  </div>
   <div class="layui-form-item">
    <label class="layui-form-label">面试地址</label>
    <div class="layui-input-inline">
      <input type="text" name="text" required lay-verify="required" value="${hr_place}" disabled placeholder="" autocomplete="off" class="layui-input">
    </div>
  </div>
 <div class="layui-form-item">
    <label class="layui-form-label">温馨提示</label>
    <div class="layui-input-inline">
      <input type="text" name="text" required lay-verify="required" placeholder="" autocomplete="off" class="layui-input">
    </div>
  </div>
<div class="layui-form-item">
    <label class="layui-form-label">面试日期</label>
    <div  class="layui-input-inline">
      <input  autocomplete="off" type="text" class="layui-input" id="time">
  </div>
  </div>
  
  
  <div class="layui-form-item">
<div style="width: 420px;margin-left: 50px" class="layui-input-inline">
  
     <button week="${nweekDay1}" style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek">本周一</button>
    <button week="${nweekDay2}" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek">本周二</button>
    <button week="${nweekDay3}" style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek">本周三</button>
    <button week="${nweekDay4}" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek">本周四</button>   
    <button week="${nweekDay5}" style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek">本周五</button>
  <br/>
   <button week="${weekDay1}" style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek">下周一</button>
    <button week="${weekDay2}" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek">下周二</button>
    <button week="${weekDay3}" style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek">下周三</button>
    <button week="${weekDay4}" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek">下周四</button>   
    <button week="${weekDay5}" style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek">下周五</button>
   
  </div>
  </div>

  <div class="layui-form-item">
    <label class="layui-form-label">面试时间</label>
    <div class="layui-input-inline">
      <input autocomplete="off" type="text" class="layui-input test-item1" id="time1">
  </div>
   <div class="layui-form-item">
<div style="width: 420px;margin-left: 50px" class="layui-input-inline">
  
   <button style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs settime">9:00</button>
    <button type="button" class="layui-btn layui-btn-primary layui-btn-xs settime">10:00</button>
       <button style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs settime">13:00</button>
    <button type="button" class="layui-btn layui-btn-primary layui-btn-xs settime">14:00</button>   
    <button style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs settime">15:00</button>
    <br/>
       <button style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs settime">9:30</button>
    <button type="button" class="layui-btn layui-btn-primary layui-btn-xs settime">10:30</button>
       <button style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs settime">13:30</button>
    <button type="button" class="layui-btn layui-btn-primary layui-btn-xs settime">14:30</button>   
    <button style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs settime">15:30</button>
    <br/>
  </div>
  </div>

  
  <br/><br/><br/><br/>
  <div style="margin-top: 10px" class="layui-form-item">
    <label class="layui-form-label"></label>
    <div class="layui-input-inline">
        <button style="text-align: center" id="commitMsg" type="button" class="layui-btn layui-btn-normal">立即提交</button>
  </div>
  <script>
// layui.use(['layer', 'form', 'element', 'laydate'], function () {
//     var layer = layui.layer, form = layui.form, element = layui.element, laydate = layui.laydate;
    
   
    
    
    // lay('.test-item').each(function () {
    //     laydate.render({
    //         elem: this
    //         , format: 'yyyy-MM-dd'   
    //         , trigger: 'click'
    //     });
    //    
    //    
    // });
    //
    // lay('.test-item1').each(function () {
    //     laydate.render({
    //         elem: this,
    //             type: 'time'
    // ,min: '10:00:00'
    // ,max: '16:00:00'
    // ,btns: ['clear', 'confirm']
    // , trigger: 'click'
    //     });
    //    
    //    
    // });
    //
    //
    //
    // form.render();
    //
  
// });

$(document).on('click', '#commitMsg', function () {
    var status = 3;
    //TODO 取值加发短信 还没提供短信接口
    submitInterviewById(interviewId, "/api/interviews/", status, '面试');

});


$(document).on('click', '.setweek', function () {
     console.log($(this).attr('week'));
    $('#time').val($(this).attr('week'));    

});
$(document).on('click', '.settime', function () {
     console.log($(this).html());
    $('#time1').val($(this).html());    

});


 
</script>
`,

        cancel: function (index) {
            layer.close(index)
        },

        yes: function (index, layero) {
            // layer.alert($('#time').val());
            //发送短信api
            layer.msg('短信发送成功');
            //do something
            layer.close(index); //如果设定了yes回调，需进行手工关闭
                var status = 3;
    submitInterviewById(interviewId, "/api/interviews/", status, '面试');
        }
    })
    // var status = 3;
    // submitInterviewById(interviewId, "/api/interviews/", status, '面试');
});

$(document).on('click', '#btn21', function () {
    window.parent.chat_wechat(resumeId,interviewId)
})



var dightCnt1 = 0
$(document).on('click', '#btn11', function () {
    // window.parent.stage_one_pass();
       //简单处理弹出两次弹出两次的情况
    dightCnt1++;
    if (dightCnt1 % 2 === 0) {
        return false;
    }

    window.parent.do_stage_zero_pass(resumeId,interviewId)
});
$(document).on('click', '#btn12', function () {
    window.parent.stage_four_fail();
});

//放一系列调起父级页面的窗口
$(document).on('click', '#btn31', function () {
    window.parent.stage_three_miss();
});


$(document).on('click', '#btn32', function () {
    window.parent.stage_three_pass();
});

$(document).on('click', '#btn41', function () {
    window.parent.stage_four_update()
});
$(document).on('click', '#btn42', function () {
    window.parent.stage_four_pass()
});
$(document).on('click', '#btn51', function () {
    // window.parent.stage_five_update()
    window.parent.stage_four_pass()

});
$(document).on('click', '#btn52', function () {
    window.parent.stage_five_pass()
});
$(document).on('click', '#btn61', function () {
    window.parent.stage_six_pass()
});
$(document).on('click', '#btn62', function () {
    window.parent.stage_six_fail()
});
$(document).on('click', '#commonRollback', function () {
    window.parent.rollback_btn()
});


var dightCnt2 = 0
var dightCnt3 = 0

$(document).on('click', '#weilianxishang', function () {
    dightCnt2++;
    if (dightCnt2 % 2 === 0) {
        return false;
    }
    window.parent.otherRejectSubmit("weilianxishang","未联系上",resumeId,interviewId)
});
$(document).on('click', '#haomacuowu', function () {
    dightCnt3++;
    if (dightCnt3 % 2 === 0) {
        return false;
    }
    window.parent.otherRejectSubmit("haomacuowu","号码错误",resumeId,interviewId)
});







//放弃面试
$(document).on('click', '#giveupInterviewButton', function () {
    localStorage.setItem("iframe_op","1");
    localStorage.setItem("iframe_interviewId", interviewId);
    window.parent.stage_four_fail(interviewId);
    return false;

    // return false;
    var status = -1;//9;
    var resume_info = JSON.parse(localStorage.getItem('resume_info'));

    // layer.open({
    //     type: 2,
    //     // closeBtn: 1,
    //     skin: 'layui-layer-rim', //加上边框
    //     area: ['300px', '220px'], //宽高
    //     content: ``
    // });


    // //添加放弃面试的理由 , 放在val中
    // layer.prompt({title: '请输入放弃理由', formType: 0}, function (pass, index) {
    //     layer.msg('操作成功')
    //     resumeLog(resume_info.id, 'give_up', pass)
    //     layer.close(index);
    //     setTimeout(function () {
    //         submitInterviewById(interviewId, "/api/interviews/", status, '不合适');
    //     }, 500);
    // });
});


function submitInterviewById(interviewId, url, status_value, sub_status) {
    //项目Id
    post_selected_value = projectId = $('#resumeInfo').attr('projectId')
    var interview_id = $('#resumeInfo').attr('interviewId')
    var data = {
        "is_active": true,
        "status": status_value,
        "post": post_selected_value,
        "result": "Pending",
        "sub_status": sub_status,
    };

    xhr_common_send("PATCH", url + interview_id + '/', data);

    layer.alert('操作成功', {
        closeBtn: 0
    }, function () {
        parent.layer.closeAll()
        // location.reload();
        //应该刷新父窗口
        // window.parent.location.reload();
        localStorage.setItem("needRefresh", "1");
    });
}

//====================================
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function xhr_common_send(method, url, data, succCallback = null) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    var csrftoken = getCookie('csrftoken');

    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    console.log("------------------------------------>")

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) { //if complete
            // 2xx is ok, ref: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
            if (xhr.status >= 200 && xhr.status < 300) {
                if (succCallback) {
                    succCallback(JSON.parse(xhr.response))
                }
                console.log("success")
            } else {
                console.log("csrftoken: ", csrftoken)
                console.log(xhr.responseText)
                console.log(xhr.status)
                console.log(xhr.statusText)
                console.log(url)
                console.log(data)
                alert("Something error happend\n");
            }
        }
    }
    xhr.send(JSON.stringify(data));
}

