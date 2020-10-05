var resumeId = -1
var projectId = -1
var interviewId = -1
var exp_map = {}

$(document).ready(function () {
    resumeId = $('#resumeInfo').attr('resumeId')
    projectId = $('#resumeInfo').attr('projectId')
    console.log("projectInfo resumeId(", resumeId, ")")
    console.log("projectInfo projectId(", projectId, ")")
    GetProjectInfo()
});

function showContent(content) {
    layer.msg('描述:' + content)
}

function renderBtn(title, content) {
    return '<button onclick="showContent(\'' + content + '\')" style="background-color: #f7e64c;margin-right: 10px" type="button" class="stage_two_dail btn btn-sm ">' + title + '</button>';
}

function GetProjectInfo() {
    xhr_common_send('GET', '/api/posts/' + projectId + '/', null, function (response) {
        var talk_hint = response.talk_hint
        console.log("talk_:", response)
        console.log("talk_hint:", talk_hint, ".")
        //包含弹窗信息需要的内容
        localStorage.setItem("project_info", JSON.stringify(response));
        $('#projectTaskHint').html(talk_hint)
        $('#question').html(response.question || '')

        console.log('interviewId=', interviewId)
/*
        if (interviewId && interviewId != '') {
            //答案 赋值
            $.ajax({
                url: '/api/queryQuestion',
                type: 'POST',
                data: {
                    interview_id: interviewId
                },
                success: function (res) {
                    $('#answer').val(res||'')
                }
            })
        }
*/
        xhr_common_send('GET', "/interview/ai/detail?resume_id=" + resumeId + "&post_id=" + projectId, null, function (response) {
           
            $('#baiying_detail2').val(response.phoneLogs)
            $('#baiying_detail_luyin').attr('src',response.luyinOssUrl);
            var fry_audio=$('#baiying_detail_luyin').get('0');
            fry_audio.load();
           // $('#baiying_detail_luyin').src(response.luyinOssUrl)       
            $('#baiying_detail_seconds2').text("时长:" + response.phoneDuration + ",评级:" + response.resultName+ ",轮次:" + response.chatRound+ ",标签:" + response.phoneTags+ ",挂断方:" + response.hangUp)
            // $('#ai_result_projname').text(response.phoneJobName)
           // $('#baiying_detail_tags').text(response.phoneTags)

            //startTime , resultValue

        })

        now_interview_status=localStorage.getItem("now_interview_status")
        console.log('now_interview_status:',localStorage.getItem('now_interview_status'))
         if (now_interview_status >1 || now_interview_status <0) {
           $('#yaoyue_detail_li').show();
           xhr_common_send('GET', "/api/interviewsubphonecalllog?resume_id=" + resumeId + "&post_id=" + projectId + "&interview_status=2" , null, function (response) {         
               $.each(response.results, function (index, ele) {
                   $('#yaoyue_detail_luyin').attr('src','https://yunzhitel-recorder.oss-cn-shenzhen.aliyuncs.com/'+ele.filepath);
               });
               var fry_audio=$('#yaoyue_detail_luyin').get('0');
               fry_audio.load();
           })

           xhr_common_send('GET', "/api/tags?resume_id=" + resumeId + "&post_id=" + projectId + "&interview_status=2" , null, function (response) {         
            $.each(response.results, function (index, ele) {
                var createStr = new Date(ele.created).format('yyyy-MM-dd hh:mm:ss');
                var tagInfo = `<span style="border: 2px solid #E8E8E8">${createStr} ${ele.operator}-${ele.step}:${ele.tag}</span><br/>`
                $('#yaoyue_userTagPanel').append(tagInfo)
            });
  
           })
           }
   
           if (now_interview_status >3 || now_interview_status <0) {
               $('#offer_detail_li').show();
           xhr_common_send('GET', "/api/interviewsubphonecalllog?resume_id=" + resumeId + "&post_id=" + projectId + "&interview_status=4" , null, function (response) {         
               $.each(response.results, function (index, ele) {
                   $('#offer_detail_luyin').attr('src','https://yunzhitel-recorder.oss-cn-shenzhen.aliyuncs.com/'+ele.filepath);
               });  
               var fry_audio=$('#offer_detail_luyin').get('0');
               fry_audio.load();
           })

           xhr_common_send('GET', "/api/tags?resume_id=" + resumeId + "&post_id=" + projectId + "&interview_status=4" , null, function (response) {         
            $.each(response.results, function (index, ele) {
                var createStr = new Date(ele.created).format('yyyy-MM-dd hh:mm:ss');
                var tagInfo = `<span style="border: 2px solid #E8E8E8">${createStr} ${ele.operator}-${ele.step}:${ele.tag}</span><br/>`
                $('#offer_userTagPanel').append(tagInfo)
            });
  
           })
        }
         if (now_interview_status >4 || now_interview_status <0) {
           $('#ruzhi_detail_li').show();
           xhr_common_send('GET', "/api/interviewsubphonecalllog?resume_id=" + resumeId + "&post_id=" + projectId + "&interview_status=5" , null, function (response) {         
               $.each(response.results, function (index, ele) {
                   $('#ruzhi_detail_luyin').attr('src','https://yunzhitel-recorder.oss-cn-shenzhen.aliyuncs.com/'+ele.filepath);
               });
               var fry_audio=$('#ruzhi_detail_luyin').get('0');
               fry_audio.load();
           })

           xhr_common_send('GET', "/api/tags?resume_id=" + resumeId + "&post_id=" + projectId + "&interview_status=5" , null, function (response) {         
            $.each(response.results, function (index, ele) {
                var createStr = new Date(ele.created).format('yyyy-MM-dd hh:mm:ss');
                var tagInfo = `<span style="border: 2px solid #E8E8E8">${createStr} ${ele.operator}-${ele.step}:${ele.tag}</span><br/>`
                $('#ruzhi_userTagPanel').append(tagInfo)
            });
  
           })
         }

  
        //判断显示AI还是指引
        var is_shaixuan = localStorage.getItem("is_shaixuan");


        if (!is_shaixuan || is_shaixuan == 0) {
            $('#huashuzhiyin_li').show();
   
        } else {
            $('#baiying_detail_li').show();
            /*
            $('#baiying_detail_li').show();
            xhr_common_send('GET', "/interview/ai/detail?resume_id=" + resumeId + "&post_id=" + projectId, null, function (response) {
                console.log("success: ", response)
                console.log(response.phoneLogs)
                console.log("success: ", response)
                console.log(response.phoneLogs)
                $('#baiying_detail').val(response.phoneLogs)
                $('#baiying_detail_seconds').text("时间:" + response.phoneDuration + ",评级:" + response.resultName)
                // $('#ai_result_projname').text(response.phoneJobName)
                $('#baiying_detail_tags').text(response.phoneTags)

                //startTime , resultValue

            })
            */
        }



        var tips = [
            'prologue',
            'workplace',
            'work_purpose',
            'wechat_invite',
        ];
        for (let i = 0; i < tips.length; i++) {
            $('#' + tips[i]).html(response[tips[i]])
        }
        var projectDesc = response['project_name'].split('-')[0];
        $('#interviewStatus').html('目前环节:' + projectDesc);


        //给关键词btn做渲染
        var html = '';
        if (response.keywords != "") {
            var keywords = JSON.parse(response.keywords);
            for (var k in keywords) {
                html += renderBtn(k, keywords[k]);
            }
        }
        document.getElementById("show_keywords").innerHTML = html


    })
}

// Meta Function
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
