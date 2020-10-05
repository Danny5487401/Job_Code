var resumeId = -1
var projectId = -1
var interviewId = -1
var experience_id = -1
var on_experience_add = false
var exp_map = {}

$(document).ready(function () {
    resumeId = $('#resumeInfo').attr('resumeId')
    projectId = localStorage.getItem("test_box_useprojectid")//$('#resumeInfo').attr('projectId')
    interviewId = $('#resumeInfo').attr('interviewId')
    console.log("basicInfo resumeId(",
        resumeId, ") projectId(",
        projectId, ") interviewId(",
        interviewId, ")")
    GetResumeTag()
    GetExpectedInfo()
    GetOPLog(resumeId);

});

function appendLog(ele) {

    var colMap = {
        expected_industry: {
            real: 'hangyeleibie',
            name: '期望行业',
            valMap: {
                '-1': '空',
                '1': '计算机软件',
                '2': '通信',
                '3': '建筑',
                '4': '房地产',
                '5': '家具装修',
                '6': '其他',
            }
        },
        expected_post: {
            real: 'gangweileibie',
            name: '期望岗位',
            valMap: {
                '-1': '空',
                '1': '普通员工',
                '2': '项目经理',
                '3': '总监',
            }
        },
        expected_restmodel: {
            real: 'gangweizuoxi',
            name: '期望作息时间',
            valMap: {
                '-1': '空',
                '1': '做五休二',
                '2': '单双休',
                '3': '单休',
                '4': '无休'
            }
        },
        //弃用
        expected_insurance_place_type: {
            name: '期望社保购买地',
            valMap: {
                '-1': '空',
                '1': '本地最低',
                '2': '本地实缴',
                '3': '外地最低',
                '4': '外地实缴',
                '5': '不够买'
            }
        },
        expected_insurance_time_type: {
            real: 'shebaogongjijin',
            name: '期望社保公积金',
            valMap: {
                '-1': '空',
                '1': '转正购买',
                '2': '入职购买',
                '3': '不够买',
            }
        },
        expected_salary: {
            real: 'xinzidaiyu',
            name: '期望薪水',
        },
        //新属性
        'gangweitezheng': {
            real: 'gangweitezheng',
            name: '岗位特征',
        },
        'gangweijibie': {
            real: 'gangweijibie',
            name: '岗位级别'
        },
        'weilianxishang': {
            real: 'weilianxishang',
            name: '未联系上'
        },
        'haomacuowu': {
            real: 'haomacuowu',
            name: '号码错误'
        },
        give_up: {
            name: '操作为'
        }
    };

        var createStr = new Date(ele.created).format('yyyy-MM-dd hh:mm:ss');
        console.log('ele.col', ele.col)
            console.log('colMap[ele.col]', colMap[ele.col])
        var processVal;
    var isElse = false;
        if(ele.col == 'expected_salary'){
            processVal =  ele.val;
        }else if (ele.col == 'give_up') {
            processVal = '放弃面试'
        } else if (ele.col == 'muqianjuzhudi') {
            processVal = ele.val
        } else if (ele.col == 'not') {
            processVal = '不找工作'
        }else{
            isElse = true
            // processVal  =  colMap[ele.col].valMap[ele.val]
            $.ajax({
                type: "GET",
                url: '/api/labellibslist/?kind=' + colMap[ele.col].real,
                dataType: "json",
                success: function (data) {
                    for (var d of data.results) {
                        if (d.id == ele.val) {
                            processVal = d.name
                            var html = `<span class="layui-col-sm12">
                        ${createStr} 简历-【${colMap[ele.col].name}】修改为【${processVal}】     
                            </span>`;

                            $('#resumeOPLogPanel').append(html)
                            break
                        }
                    }
                }
            });
        }
    if (!isElse) {
        var html = `<span class="layui-col-sm12">
         ${createStr} 简历-【${colMap[ele.col].name}】修改为【${processVal}】     
                </span>`;

        $('#resumeOPLogPanel').append(html)
    }


}

function GetOPLog(resumeId) {
    document.getElementById('resumeOPLogPanel').innerHTML = ""
    xhr_common_send('POST', '/api/opresumeloglist?resume=' + resumeId, {resume: resumeId}, function (response) {
        console.log("-------------", response)
        // appendLog(response);
        $.each(response.list, function (index, ele) {
            //console.log("insert ", ele.id, " ", ele.tagname, "")
            console.log('oplog' , ele)
            appendLog(ele.fields)
        });
    });
}


Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

function InsertTag(ele) {
    var createStr = new Date(ele.created).format('yyyy-MM-dd hh:mm:ss');
    var tagInfo = `<span style="border: 2px solid #E8E8E8">${createStr} ${ele.operator}-${ele.step}:${ele.tag}</span><br/>`
    $('#userTagPanel').append(tagInfo)
}

function InsertLabelScore(ele) {
    
    var colMap = {
        expected_industry: {
            real: 'hangyeleibie',
            name: '期望行业',
            valMap: {
                '-1': '空',
                '1': '计算机软件',
                '2': '通信',
                '3': '建筑',
                '4': '房地产',
                '5': '家具装修',
                '6': '其他',
            }
        },
        expected_post: {
            real: 'gangweileibie',
            name: '期望岗位',
            valMap: {
                '-1': '空',
                '1': '普通员工',
                '2': '项目经理',
                '3': '总监',
            }
        },
        expected_restmodel: {
            real: 'gangweizuoxi',
            name: '期望作息时间',
            valMap: {
                '-1': '空',
                '1': '做五休二',
                '2': '单双休',
                '3': '单休',
                '4': '无休'
            }
        },
        //弃用
        expected_insurance_place_type: {
            name: '期望社保购买地',
            valMap: {
                '-1': '空',
                '1': '本地最低',
                '2': '本地实缴',
                '3': '外地最低',
                '4': '外地实缴',
                '5': '不够买'
            }
        },
        expected_insurance_time_type: {
            real: 'shebaogongjijin',
            name: '期望社保公积金',
            valMap: {
                '-1': '空',
                '1': '转正购买',
                '2': '入职购买',
                '3': '不够买',
            }
        },
        expected_salary: {
            real: 'xinzidaiyu',
            name: '期望薪水',
        },
        //新属性
        'gangweitezheng': {
            real: 'gangweitezheng',
            name: '岗位特征',
        },
        'gangweijibie': {
            real: 'gangweijibie',
            name: '岗位级别'
        },
        'weilianxishang': {
            real: 'weilianxishang',
            name: '未联系上'
        },
        'haomacuowu': {
            real: 'haomacuowu',
            name: '号码错误'
        },
        give_up: {
            name: '操作为'
        }
    };

        var createStr = new Date(ele.created).format('yyyy-MM-dd hh:mm:ss');
        console.log('ele.label', ele.label)
        //console.log('colMap[ele.label]', colMap[ele.label])
        var processVal;
    //var isElse = false;
        if(ele.label == 'expected_salary'){
            processVal =  ele.val;
            console.log('processVal', processVal)
            var tagInfo = `<span style="border: 2px solid #E8E8E8"> `+processVal+`:${ele.score}</span><br/>`
            $('#userTagPanel').append(tagInfo)
        }else if (ele.label == 'give_up') {
            processVal = '放弃面试'
            console.log('processVal', processVal)
            var tagInfo = `<span style="border: 2px solid #E8E8E8"> `+processVal+`:${ele.score}</span><br/>`
            $('#userTagPanel').append(tagInfo)
        } else if (ele.label== 'muqianjuzhudi') {
            processVal = ele.val
            console.log('processVal', processVal)
            var tagInfo = `<span style="border: 2px solid #E8E8E8"> `+processVal+`:${ele.score}</span><br/>`
            $('#userTagPanel').append(tagInfo)
        } else if (ele.label == 'not') {
            processVal = '不找工作'
            console.log('processVal', processVal)
            var tagInfo = `<span style="border: 2px solid #E8E8E8"> `+processVal+`:${ele.score}</span><br/>`
            $('#userTagPanel').append(tagInfo)
        }
        /*else{
           // isElse = true
            // processVal  =  colMap[ele.col].valMap[ele.val]
            $.ajax({
                type: "GET",
                url: '/api/labellibslist/?id=' + ele.val,
                dataType: "json",
                success: function (data) {
                    for (var d of data.results) {
                       // if (d.id == ele.val) {
                            processVal = d.name
                       //     break
                      //  }
                    }
                }
            });
        }
        */
  
      
    $.ajax({
        type: "GET",
        url: '/api/labellibslist/?id=' + ele.val,
        dataType: "json",
        success: function (data) {
            for (var d of data.results) {
               
                var tagInfo = `<span style="border: 2px solid #E8E8E8">${d.name}:${ele.score}</span><br/>`
                $('#userTagPanel').append(tagInfo)
            }
        }
    });
 
}

$(document).on('click', '#userTagAddButton', function () {
    var tagname = $('#userNewTag').val()
    var project_info = JSON.parse(localStorage.getItem('project_info'));
    var hr_name = project_info.link.substring(0, project_info.link.indexOf('('));
    var data = {
        "resume": resumeId,
        "tag": tagname,
        'operator': hr_name,
        "post_id": project_info.id,
       // "interview_id": interviewId,
        'interview_status': localStorage.getItem('now_interview_status'),     
        'step': localStorage.getItem('now_interview_status_name')
    }
    console.log("tagname", tagname)
    xhr_common_send('POST', '/api/tags/', data, function (response) {
        console.log("post successfully")
        $('#userNewTag').val("")
        GetResumeTag()
    })

});

function GetResumeTag() {
    document.getElementById('userTagPanel').innerHTML = ""
    xhr_common_send('GET', '/api/tags/?resume_id=' + resumeId, null, function (response) {
        console.log("-------------", response)
        $.each(response.results, function (index, ele) {
            //console.log("insert ", ele.id, " ", ele.tagname, "")
            InsertTag(ele)
        });
    });
    xhr_common_send('GET', '/api/labelscore/?resume=' + resumeId, null, function (response) {
        console.log("-------------", response)
        $.each(response.results, function (index, ele) {
            //console.log("insert ", ele.id, " ", ele.tagname, "")
            InsertLabelScore(ele)
        });
    });   
}

var hangye_obj = {};
var gangwei_obj = {};


function saveHG() {
    console.log('listen change')
    var val = $('#userExpectArea').val()

    var data = {
        "expected_industry": val,
    }
    console.log("Prepare to update the resume Info data:", data)
    console.log(hangye_obj)

    //分割val
    var strArr = val.split('|')

    xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
        for (var s of strArr) {
            if (s != '' && hangye_obj[s]) {
                console.log(hangye_obj[s], s)
                resumeLog(resumeId, "expected_industry", hangye_obj[s])
            }
        }
    })


    (function () {

        var val = $('#userExpectPost').val()
        var data = {
            "expected_post": val,
        }
        console.log("Prepare to update the resume Info data:", data)
        var strArr = val.split('|')
        console.log(gangwei_obj)
        xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
            for (var s of strArr) {
                if (s != '' && gangwei_obj[s]) {
                    console.log(gangwei_obj[s], s)
                    resumeLog(resumeId, "expected_post", gangwei_obj[s])
                }
            }
        });

    })()


}


function resumeLog(resume, col, val = '') {
    $.ajax({
        method: "POST",
        url: "/api/opresumelog",
        async:false,
        data: {
            resume,
            col,
            val,
            post_id: projectId
        },
        success: function (response) {
            GetOPLog(resume)
            console.log(response)
            // window.location.reload();
        },
    });
}


//修改为监听radio
$(document).ready(function () {
    $("input[name=work_status]").each(function () {
        $(this).click(function () {
            var value = $("input[name=work_status]:checked").val();
            // alert('选中val' + value);
            var val = value
            var data = {
                "hunting_status": val,
            }
            console.log("Prepare to update the resume Info data:", data)
            xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
                console.log("success update resume Info")
            })
        });
    });
});

// $(document).on('change', '#userCurJobState', function () {
//     var val = $('#userCurJobState').val()
//     var data = {
//         "hunting_status": val,
//     }
//     console.log("Prepare to update the resume Info data:", data)
//     xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
//         console.log("success update resume Info")
//     })
// });

// $(document).on('change', '#userExpectArea', function () {
//     var val = $('#userExpectArea').val()
//     var data = {
//         "expected_industry": val,
//     }
//     console.log("Prepare to update the resume Info data:", data)
//     xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
//         resumeLog(resumeId, "expected_industry", val);
//         console.log("success update resume Info")
//     })
// });


// $(document).on('change', '#userExpectPost', function () {
//     var val = $('#userExpectPost').val()
//     var data = {
//         "expected_post": val,
//     }
//     console.log("Prepare to update the resume Info data:", data)
//     xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
//         resumeLog(resumeId, "expected_post", val);
//         console.log("success update resume Info")
//     })
// });

$(document).on('change', '#userExpectRestModel', function () {
    var val = $('#userExpectRestModel').val()
    var data = {
        "expected_restmodel": val,
    }
    console.log("Prepare to update the resume Info data:", data)
    xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
        resumeLog(resumeId, "expected_restmodel", val);

        console.log("success update resume Info")
    })
});


$(document).on('change', '#userExpectInsurancePlace', function () {
    var val = $('#userExpectInsurancePlace').val()
    var data = {
        "expected_insurance_place_type": val,
    }
    console.log("Prepare to update the resume Info data:", data)
    xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
        resumeLog(resumeId, "expected_insurance_place_type", val);

        console.log("success update resume Info")
    })
});

$(document).on('change', '#userExpectInsuranceTime', function () {
    var val = $('#userExpectInsuranceTime').val()
    var data = {
        "expected_insurance_time_type": val,
    }
    console.log("Prepare to update the resume Info data:", data)
    xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
        resumeLog(resumeId, "expected_insurance_time_type", val);

        console.log("success update resume Info")
    })
});

$(document).on('change', '#userExpectSalary', function () {
    var val = $('#userExpectSalary').val()
    var data = {
        "expected_salary": val,
    }
    console.log("Prepare to update the resume Info data:", data)
    xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
        resumeLog(resumeId, "expected_salary", val);

        console.log("success update resume Info")
    })
});

var SelectColor = (function () {
    var d = null;
    var c = [];
    var b = {
        elem: ".select-color",
        range: "|",
        left: 0,
        index: 0,
        data:
            [{
                colorName: "白色系",
                colorNum: "rgb(255, 255, 255)",
                colorList: [{colorName: "乳白色", colorNum: "rgb(255, 251, 240)"}, {
                    colorName: "白色",
                    colorNum: "rgb(255, 255, 2255)"
                }, {colorName: "米白色", colorNum: "rgb(238, 222, 176)"}]
            }, {
                colorName: "灰色系",
                colorNum: "rgb(128, 128, 128)",
                colorList: [{colorName: "浅灰色", colorNum: "rgb(228, 228, 228)"}, {
                    colorName: "深灰色",
                    colorNum: "rgb(102, 102, 102)"
                }, {colorName: "灰色", colorNum: "rgb(128, 128, 128)"}, {colorName: "银色", colorNum: "rgb(192, 192, 192)"}]
            }, {
                colorName: "黑色系",
                colorNum: "rgb(0, 0, 0)",
                colorList: [{colorName: "黑色", colorNum: "rgb(0, 0, 0)"}]
            }, {
                colorName: "红色系",
                colorNum: "rgb(255, 0, 0)",
                colorList: [{colorName: "桔红色", colorNum: "rgb(255, 117, 0)"}, {
                    colorName: "玫红色",
                    colorNum: "rgb(223, 27, 118)"
                }, {colorName: "粉红色", colorNum: "rgb(255, 182, 193)"}, {
                    colorName: "红色",
                    colorNum: "rgb(255, 0, 0)"
                }, {colorName: "藕色", colorNum: "rgb(238, 208, 216)"}, {
                    colorName: "西瓜红",
                    colorNum: "rgb(240, 86, 84)"
                }, {colorName: "酒红色", colorNum: "rgb(153, 0, 0)"}]
            }, {
                colorName: "黄色系",
                colorNum: "rgb(255, 255, 0)",
                colorList: [{colorName: "卡其色", colorNum: "rgb(195, 176, 145)"}, {
                    colorName: "姜黄色",
                    colorNum: "rgb(255, 199, 115)"
                }, {colorName: "明黄色", colorNum: "rgb(255, 255, 1)"}, {
                    colorName: "杏色",
                    colorNum: "rgb(247, 238, 214)"
                }, {colorName: "柠檬黄", colorNum: "rgb(255, 236, 67)"}, {
                    colorName: "桔色",
                    colorNum: "rgb(255, 165, 0)"
                }, {colorName: "浅黄色", colorNum: "rgb(250, 255, 114)"}, {
                    colorName: "荧光黄",
                    colorNum: "rgb(234, 255, 86)"
                }, {colorName: "金色", colorNum: "rgb(255, 215, 0)"}, {
                    colorName: "香槟色",
                    colorNum: "rgb(255, 249, 177)"
                }, {colorName: "黄色", colorNum: "rgb(255, 255, 0)"}]
            }, {
                colorName: "绿色系",
                colorNum: "rgb(0, 128, 0)",
                colorList: [{colorName: "军绿色", colorNum: "rgb(93, 118, 42)"}, {
                    colorName: "墨绿色",
                    colorNum: "rgb(0,87,55)"
                }, {colorName: "浅绿色", colorNum: "rgb(152, 251, 152)"}, {
                    colorName: "绿色",
                    colorNum: "rgb(0, 128, 0)"
                }, {colorName: "翠绿色", colorNum: "rgb(10, 163, 68)"}, {
                    colorName: "荧光绿",
                    colorNum: "rgb(35, 250, 7)"
                }, {colorName: "青色", colorNum: "rgb(0, 224, 158)"}]
            }, {
                colorName: "蓝色系",
                colorNum: "rgb(0, 0, 254)",
                colorList: [{colorName: "天蓝色", colorNum: "rgb(68, 206, 246)"}, {
                    colorName: "孔雀蓝",
                    colorNum: "rgb(0, 164, 197)"
                }, {colorName: "宝蓝色", colorNum: "rgb(75, 92, 196)"}, {
                    colorName: "浅蓝色",
                    colorNum: "rgb(210, 240, 244)"
                }, {colorName: "深蓝色", colorNum: "rgb(4, 22, 144)"}, {
                    colorName: "湖蓝色",
                    colorNum: "rgb(48, 223, 243)"
                }, {colorName: "蓝色", colorNum: "rgb(0, 0, 254)"}, {colorName: "藏青色", colorNum: "rgb(46, 78, 126)"}]
            }, {
                colorName: "紫色系",
                colorNum: "rgb(128, 0, 128)",
                colorList: [{colorName: "浅紫色", colorNum: "rgb(237, 224, 230)"}, {
                    colorName: "深紫色",
                    colorNum: "rgb(67, 6, 83)"
                }, {colorName: "紫红色", colorNum: "rgb(139, 0, 98)"}, {
                    colorName: "紫罗兰",
                    colorNum: "rgb(183, 172, 228)"
                }, {colorName: "紫色", colorNum: "rgb(128, 0, 128)"}]
            }, {
                colorName: "棕色系",
                colorNum: "rgb(124, 75, 0)",
                colorList: [{colorName: "巧克力色", colorNum: "rgb(210,105,30)"}, {
                    colorName: "标土棕",
                    colorNum: "rgb(115,74,18)"
                }, {colorName: "赭色", colorNum: "rgb(160,82,45)"}, {
                    colorName: "乌贼墨棕",
                    colorNum: "rgb(94,38,18)"
                }, {colorName: "沙棕色", colorNum: "rgb(244,164,96)"}, {
                    colorName: "栗色",
                    colorNum: "rgb(125, 0, 0)"
                }, {colorName: "棕色", colorNum: "rgb(124, 75, 0)"}]
            }]
    };
    var e = Object.assign || function (j) {
        for (var g = 1; g < arguments.length; g++) {
            var h = arguments[g];
            for (var f in h) {
                if (Object.prototype.hasOwnProperty.call(h, f)) {
                    j[f] = h[f]
                }
            }
        }
        return j
    };

    function a() {
        d = e({}, b, arguments[0]);
        var f = this;
        this.index = d.index;
        this.createElement(function () {
            f.render()
        })
    }

    a.prototype.createElement = function (f) {
        this.mainbox = document.createElement("div");
        this.nav = document.createElement("ul");
        this.box = document.createElement("div");
        this.colorlist = document.createElement("ul");
        $(this.mainbox).addClass("color-group-wrapper color-dropdown-wrapper");
        $(this.nav).addClass("color-group-panel");
        $(this.box).addClass("colors-panel");
        $(this.colorlist).addClass("color-list");
        $(this.box).html('<p class="colors-panel-title"></p>');
        $(this.box).append(this.colorlist);
        $(this.mainbox).append(this.nav);
        $(this.mainbox).append(this.box);
        f && f()
    };
    a.prototype.render = function () {
        var l = this;
        var h = $(this.mainbox);
        var n = $(this.nav);
        var k = $(this.colorlist);
        var g = $(d.elem);
        var f = null;
        var o = "";
        var m = "";
        for (var j = 0; j < d.data.length; j++) {
            o += '<li class="color-tag" data-index="' + j + '">' + '<a href="javascript:void(0)">' + '<div class="color-block" style="background:' + d.data[j]["colorNum"] + ';"></div>' + "<span>" + d.data[j]["colorName"] + "</span>" + "</a>" + "</li>"
        }
        n.html(o);
        k.html(this.createList());
        $("body").append(this.mainbox);
        n.find("li.color-tag").hover(function (p) {
            p.stopPropagation();
            var i = $(this).attr("data-index");
            if (i == l.index) {
                return
            }
            l.index = i;
            k.html(l.createList())
        });
        $("body").on("click", ".color-group-panel li.color-tag", function (i) {
            i.stopPropagation()
        });
        $("body").on("click", ".color-list li.color-tag", function (q) {
            q.stopPropagation();
            var p = $(this).attr("data-index");
            console.log('p', p);
            console.log('d.data[l.index]["colorList"]', d.data[l.index]["colorList"])
            console.log('d', d)
            var i = d.data[l.index]["colorList"][p]["colorName"];
            console.log(f)
            if (f.val() != "") {
                c = f.val().split(d.range)
            } else {
                c = []
            }
            if (c.indexOf(i) != -1) {
                return
            }

            //给当前加背景
            // $(this).attr({"background":'#EEEEEE'});

            c.push(i);
            f.val(c.join(d.range));
            c.length = 0
        });
        h.css({display: "none"});
        g.off("click").on("click", function (q) {
            q.stopPropagation();
            f = $(this);
            if (f.val() != "") {
                c = f.val().split(d.range)
            }
            var p = f.offset().left + d.left;
            var i = f.offset().top + f.get(0).offsetHeight;
            h.css({position: "absolute", left: p, top: i, display: "block", zIndex: "2999"});
            $("html").off("click").on("click", function () {
                h.hide()
            })
        })
    };
    a.prototype.createList = function () {
        var h = "";
        var f = this.index;
        var j = d.data[f]["colorList"];
        for (var g = 0; g < j.length; g++) {
            h += '<li class="color-tag" data-index="' + g + '">' + '<a href="javascript:void(0)">' + '<div class="color-block" style="background:' + j[g]["colorNum"] + ';"></div>' + "<span>" + j[g]["colorName"] + "</span>" + "</a>" + "</li>"
        }
        return h
    };
    return a
}());
var SelectColor1 = (function () {
    var d = null;
    var c = [];
    var b = {
        elem: ".select-color",
        range: "|",
        left: 0,
        index: 0,
        data: [{
            colorName: "白色系",
            colorNum: "rgb(255, 255, 255)",
            colorList: [{colorName: "乳白色", colorNum: "rgb(255, 251, 240)"}, {
                colorName: "白色",
                colorNum: "rgb(255, 255, 2255)"
            }, {colorName: "米白色", colorNum: "rgb(238, 222, 176)"}]
        }, {
            colorName: "灰色系",
            colorNum: "rgb(128, 128, 128)",
            colorList: [{colorName: "浅灰色", colorNum: "rgb(228, 228, 228)"}, {
                colorName: "深灰色",
                colorNum: "rgb(102, 102, 102)"
            }, {colorName: "灰色", colorNum: "rgb(128, 128, 128)"}, {colorName: "银色", colorNum: "rgb(192, 192, 192)"}]
        }, {
            colorName: "黑色系",
            colorNum: "rgb(0, 0, 0)",
            colorList: [{colorName: "黑色", colorNum: "rgb(0, 0, 0)"}]
        }, {
            colorName: "红色系",
            colorNum: "rgb(255, 0, 0)",
            colorList: [{colorName: "桔红色", colorNum: "rgb(255, 117, 0)"}, {
                colorName: "玫红色",
                colorNum: "rgb(223, 27, 118)"
            }, {colorName: "粉红色", colorNum: "rgb(255, 182, 193)"}, {
                colorName: "红色",
                colorNum: "rgb(255, 0, 0)"
            }, {colorName: "藕色", colorNum: "rgb(238, 208, 216)"}, {
                colorName: "西瓜红",
                colorNum: "rgb(240, 86, 84)"
            }, {colorName: "酒红色", colorNum: "rgb(153, 0, 0)"}]
        }, {
            colorName: "黄色系",
            colorNum: "rgb(255, 255, 0)",
            colorList: [{colorName: "卡其色", colorNum: "rgb(195, 176, 145)"}, {
                colorName: "姜黄色",
                colorNum: "rgb(255, 199, 115)"
            }, {colorName: "明黄色", colorNum: "rgb(255, 255, 1)"}, {
                colorName: "杏色",
                colorNum: "rgb(247, 238, 214)"
            }, {colorName: "柠檬黄", colorNum: "rgb(255, 236, 67)"}, {
                colorName: "桔色",
                colorNum: "rgb(255, 165, 0)"
            }, {colorName: "浅黄色", colorNum: "rgb(250, 255, 114)"}, {
                colorName: "荧光黄",
                colorNum: "rgb(234, 255, 86)"
            }, {colorName: "金色", colorNum: "rgb(255, 215, 0)"}, {
                colorName: "香槟色",
                colorNum: "rgb(255, 249, 177)"
            }, {colorName: "黄色", colorNum: "rgb(255, 255, 0)"}]
        }, {
            colorName: "绿色系",
            colorNum: "rgb(0, 128, 0)",
            colorList: [{colorName: "军绿色", colorNum: "rgb(93, 118, 42)"}, {
                colorName: "墨绿色",
                colorNum: "rgb(0,87,55)"
            }, {colorName: "浅绿色", colorNum: "rgb(152, 251, 152)"}, {
                colorName: "绿色",
                colorNum: "rgb(0, 128, 0)"
            }, {colorName: "翠绿色", colorNum: "rgb(10, 163, 68)"}, {
                colorName: "荧光绿",
                colorNum: "rgb(35, 250, 7)"
            }, {colorName: "青色", colorNum: "rgb(0, 224, 158)"}]
        }, {
            colorName: "蓝色系",
            colorNum: "rgb(0, 0, 254)",
            colorList: [{colorName: "天蓝色", colorNum: "rgb(68, 206, 246)"}, {
                colorName: "孔雀蓝",
                colorNum: "rgb(0, 164, 197)"
            }, {colorName: "宝蓝色", colorNum: "rgb(75, 92, 196)"}, {
                colorName: "浅蓝色",
                colorNum: "rgb(210, 240, 244)"
            }, {colorName: "深蓝色", colorNum: "rgb(4, 22, 144)"}, {
                colorName: "湖蓝色",
                colorNum: "rgb(48, 223, 243)"
            }, {colorName: "蓝色", colorNum: "rgb(0, 0, 254)"}, {colorName: "藏青色", colorNum: "rgb(46, 78, 126)"}]
        }, {
            colorName: "紫色系",
            colorNum: "rgb(128, 0, 128)",
            colorList: [{colorName: "浅紫色", colorNum: "rgb(237, 224, 230)"}, {
                colorName: "深紫色",
                colorNum: "rgb(67, 6, 83)"
            }, {colorName: "紫红色", colorNum: "rgb(139, 0, 98)"}, {
                colorName: "紫罗兰",
                colorNum: "rgb(183, 172, 228)"
            }, {colorName: "紫色", colorNum: "rgb(128, 0, 128)"}]
        }, {
            colorName: "棕色系",
            colorNum: "rgb(124, 75, 0)",
            colorList: [{colorName: "巧克力色", colorNum: "rgb(210,105,30)"}, {
                colorName: "标土棕",
                colorNum: "rgb(115,74,18)"
            }, {colorName: "赭色", colorNum: "rgb(160,82,45)"}, {
                colorName: "乌贼墨棕",
                colorNum: "rgb(94,38,18)"
            }, {colorName: "沙棕色", colorNum: "rgb(244,164,96)"}, {
                colorName: "栗色",
                colorNum: "rgb(125, 0, 0)"
            }, {colorName: "棕色", colorNum: "rgb(124, 75, 0)"}]
        }]
    };
    var e = Object.assign || function (j) {
        for (var g = 1; g < arguments.length; g++) {
            var h = arguments[g];
            for (var f in h) {
                if (Object.prototype.hasOwnProperty.call(h, f)) {
                    j[f] = h[f]
                }
            }
        }
        return j
    };

    function a() {
        d = e({}, b, arguments[0]);
        var f = this;
        this.index = d.index;
        this.createElement(function () {
            f.render()
        })
    }

    a.prototype.createElement = function (f) {
        this.mainbox = document.createElement("div");
        this.nav = document.createElement("ul");
        this.box = document.createElement("div");
        this.colorlist = document.createElement("ul");
        $(this.mainbox).addClass("color-group-wrapper color-dropdown-wrapper");
        $(this.nav).addClass("color-group-panel");
        $(this.box).addClass("colors-panel");
        $(this.colorlist).addClass("color-list");
        $(this.box).html('<p class="colors-panel-title"></p>');
        $(this.box).append(this.colorlist);
        $(this.mainbox).append(this.nav);
        $(this.mainbox).append(this.box);
        f && f()
    };
    a.prototype.render = function () {
        var l = this;
        var h = $(this.mainbox);
        var n = $(this.nav);
        var k = $(this.colorlist);
        var g = $(d.elem);
        var f = null;
        var o = "";
        var m = "";
        for (var j = 0; j < d.data.length; j++) {
            o += '<li class="color-tag1" data-index="' + j + '">' + '<a href="javascript:void(0)">' + '<div class="color-block" style="background:' + d.data[j]["colorNum"] + ';"></div>' + "<span>" + d.data[j]["colorName"] + "</span>" + "</a>" + "</li>"
        }
        n.html(o);
        k.html(this.createList());
        $("body").append(this.mainbox);
        n.find("li.color-tag1").hover(function (p) {
            p.stopPropagation();
            var i = $(this).attr("data-index");
            if (i == l.index) {
                return
            }
            l.index = i;
            k.html(l.createList())
        });
        $("body").on("click", ".color-group-panel li.color-tag1", function (i) {
            i.stopPropagation()
        });
        $("body").on("click", ".color-list li.color-tag1", function (q) {
            q.stopPropagation();
            var p = $(this).attr("data-index");
            console.log('p', p);
            console.log('d.data[l.index]["colorList"]', d.data[l.index]["colorList"])
            console.log('d', d)
            var i = d.data[l.index]["colorList"][p]["colorName"];
            console.log(f)
            if (f.val() != "") {
                c = f.val().split(d.range)
            } else {
                c = []
            }
            if (c.indexOf(i) != -1) {
                return
            }

            //给当前加背景
            // $(this).attr({"background":'#EEEEEE'});

            c.push(i);
            f.val(c.join(d.range));
            c.length = 0
        });
        h.css({display: "none"});
        g.off("click").on("click", function (q) {
            q.stopPropagation();
            f = $(this);
            if (f.val() != "") {
                c = f.val().split(d.range)
            }
            var p = f.offset().left + d.left;
            var i = f.offset().top + f.get(0).offsetHeight;
            h.css({position: "absolute", left: p, top: i, display: "block", zIndex: "2999"});
            $("html").off("click").on("click", function () {
                h.hide()
            })
        })
    };
    a.prototype.createList = function () {
        var h = "";
        var f = this.index;
        var j = d.data[f]["colorList"];
        for (var g = 0; g < j.length; g++) {
            h += '<li class="color-tag1" data-index="' + g + '">' + '<a href="javascript:void(0)">' + '<div class="color-block" style="background:' + j[g]["colorNum"] + ';"></div>' + "<span>" + j[g]["colorName"] + "</span>" + "</a>" + "</li>"
        }
        return h
    };
    return a
}());

//渲染
function GetExpectedInfo() {
    var jobStateSeletor = document.getElementById("userCurJobState")
    var areaSelector = document.getElementById("userExpectArea")
    var postSelector = document.getElementById("userExpectPost")
    var insurancePlaceSelector = document.getElementById("userExpectInsurancePlace")
    var insuranceTimeSelector = document.getElementById("userExpectInsuranceTime")
    var restModelSelector = document.getElementById("userExpectRestModel")

    // GetProjectInfo();

    projectId = $('#resumeInfo').attr('projectId')


    xhr_common_send('GET', '/api/resumes/' + resumeId + '/', null, function (response) {
        console.log(response)
        console.log('hunting_status', response.hunting_status)
        //设置弹窗需要的信息
        localStorage.setItem("resume_info", JSON.stringify(response));



        //修改工作状态的radio
        if (response.hunting_status != -1) {
            var hs = response.hunting_status;
            $("input:radio[value=" + hs + "]").attr('checked', 'true');
        }


        var baseDesc = $('#interviewStatus').html();
        $('#interviewStatus').html(baseDesc + '-' + response.interview_status_name);


        // job status
        // if (response.hunting_status == -1) {
        //     console.log('hunting_status inner', response.hunting_status)
        //     jobStateSeletor.options[0].selected = true
        // } else if (response.hunting_status > 0) {
        //     jobStateSeletor.options[response.hunting_status].selected = true
        // }

        // restmodel
        // var restModelId = parseInt(response.expected_restmodel);
        // if (isNaN(restModelId)) {
        //     restModelId = 0
        // }
        // restModelSelector.options[restModelId].selected = true

        // areaSelector
        // var areaId = parseInt(response.expected_industry);
        // if (isNaN(areaId)) {
        //     areaId = 0
        // }
        // areaSelector.options[areaId].selected = true


        xhr_common_send('GET', '/api/labellibslist/?kind=hangyeleibie', {}, function (data) {

            var process = {}
            for (var da of data.results) {
                hangye_obj[da.name] = da.id

                var prop = {
                    colorName: da.name,
                    colorNum: "",
                    colorList: []
                }
                if (da.parent === 0) {
                    process[da.id] = prop
                } else {
                    if (process[da.parent]) {
                        delete prop.colorList
                        process[da.parent].colorList.push(prop)
                    }
                }

            }
            console.log(process)

            new SelectColor({
                elem: ".select-hangye",
                range: "|",
                data: Object.values(process)
            })

            $('#userExpectArea').val(response.expected_industry || '')

            // $(document).on('change', '#userExpectArea', function () {
            //     var val = $('#userExpectArea').val()
            //
            //     var data = {
            //         "expected_industry": val,
            //     }
            //     console.log("Prepare to update the resume Info data:", data)
            //     xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
            //         console.log(hangye_obj)
            //
            //         //分割val
            //         var strArr = val.split('|')
            //         for (var s of strArr) {
            //             if (s != '' && hangye_obj[s]) {
            //                 console.log(hangye_obj[s], s)
            //                 resumeLog(resumeId, "expected_industry", hangye_obj[s])
            //             }
            //         }
            //     })
            //
            // });


            // setInterval(function () {


            // }, 3000)
        })

        xhr_common_send('GET', '/api/labellibslist/?kind=gangweileibie', {}, function (data) {
            var process = {}
            for (var da of data.results) {
                gangwei_obj[da.name] = da.id
                var prop = {
                    colorName: da.name,
                    colorNum: "",
                    colorList: []
                }
                if (da.parent === 0) {
                    process[da.id] = prop
                } else {
                    if (process[da.parent]) {
                        delete prop.colorList
                        process[da.parent].colorList.push(prop)
                    }
                }

            }
            console.log(process)

            new SelectColor1({
                elem: ".select-gangwei",
                range: "|",
                data: Object.values(process)
            })

            $('#userExpectPost').val(response.expected_post || '')
        })

        // postSelector
        // var postId = parseInt(response.expected_post);
        // if (isNaN(postId)) {
        //     postId = 0
        // }
        // postSelector.options[postId].selected = true

        xhr_common_send('GET', '/api/labellibslist/?kind=gangweizuoxi', {}, function (data) {
            var html = `<option value=""></option>`;
            for (let da of data.results) {
                html += `<option value="${da.id}">${da.name}</option>`
            }
            $("#userExpectRestModel").append(html);
            $('#userExpectRestModel').val(response.expected_restmodel)

        })
        xhr_common_send('GET', '/api/labellibslist/?kind=shebaogongjijin', {}, function (data) {
            var html = `<option value=""></option>`;

            for (let da of data.results) {
                html += `<option value="${da.id}">${da.name}</option>`
            }
            $("#userExpectInsurancePlace").append(html);
            $('#userExpectInsurancePlace').val(response.expected_insurance_place_type)

        })






        // insurance_place Selector
        // var insurancePlaceId = parseInt(response.expected_insurance_place_type);
        // if (isNaN(insurancePlaceId)) {
        //     insurancePlaceId = 0
        // }
        // insurancePlaceSelector.options[insurancePlaceId].selected = true

        // insurance_time Selector
        // var insuranceTimeId = parseInt(response.expected_insurance_time_type);
        // if (isNaN(insuranceTimeId)) {
        //     insuranceTimeId = 0
        // }
        // insuranceTimeSelector.options[insuranceTimeId].selected = true

        $('#userExpectSalary').val(response.expected_salary)

    });


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
