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

// $(document).ready(function() {
var post_selected = false;
var post_selected_value = 0;

var resumes_selected = [];
var resume_selected_value = 0;

var interviews_selected = [];
var interview_selected_value = 0;

var filter_status_value = 0;
var enable_multi = false;

var toCollapsed = true;

function empty_multi_selection() {
    //empty resumes
    resumes_selected = [];
    interviews_selected = [];
}

/* return redrawed */
function button_update(table, container, toggle_value, flag = false) {
    if (!toggle_value) {
        list = container.classList;
        // Can't use toggleClass Here
        //node[0].toggleClass("btn-info");

        container.classList.remove("btn-info");
        container.innerText = "多选[N]";

        empty_multi_selection();
        table.draw(flag);
        return true;
    } else {
        container.classList.add("btn-info");
        container.innerText = "多选[Y]";
        return false;
    }
}


$(function () {
    $('select[multiple].active').multiselect();

});
var G_gsopend = {lng: 0, lat: 0};
var G_perple = [];
var G_numi = 1;


var map = new BMap.Map("l-map");
map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
map.enableScrollWheelZoom();
var p1 = new BMap.Point(116.301934, 39.977552);
var p2 = new BMap.Point(116.508328, 39.919141);
var transit = new BMap.TransitRoute(map, {
    renderOptions: {map: map, panel: "r-result"}
});
transit.search(p1, p2);

function wordgjTwice(sendbbbName, outi) {

    var map = new BMap.Map("l-map");
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
    map.enableScrollWheelZoom();

    map.clearOverlays();

    function myFun() {
        var poi = local.getResults().getPoi(0);
        if (typeof poi == "undefined" || poi == null || poi == "") {
            alert("行ID为--" + outi + "--地址为[" + sendbbbName + "]:简历的地址百度未检索到,此行不生成导航!(poi)");
            return;
        }
        var pp = local.getResults().getPoi(0).point;
        if (typeof pp == "undefined" || pp == null || pp == "") {
            alert("行ID为--" + outi + "--地址为[" + sendbbbName + "]:简历的地址百度未检索到,此行不生成导航!(pp)");
            return;
        }
        map.centerAndZoom(pp, 18);
        map.addOverlay(new BMap.Marker(pp));
        var cIdName = "aaadiv" + outi;
        var transit = new BMap.TransitRoute(map, {
            renderOptions: {map: map, panel: cIdName},
            pageCapacity: 1
        });

        var slng = G_gsopend.lng;
        var slat = G_gsopend.lat;
        var gspoint = new BMap.Point(slng, slat);
        var elng = pp.lng;
        var elat = pp.lat;
        var gspointend = new BMap.Point(elng, elat);
        G_numi++;
        transit.search(gspoint, gspointend);
    }

    var local = new BMap.LocalSearch(map, {
        onSearchComplete: myFun
    });
    local.search(sendbbbName);
};

function wordgjFirst(sendaaaName, fbbbName, outi) {
    var map = new BMap.Map("l-map");
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
    map.enableScrollWheelZoom();

    map.clearOverlays();

    function myFun() {
        var poi = local.getResults().getPoi(0);
        if (typeof poi == "undefined" || poi == null || poi == "") {
            alert("百度未检索到起点(poi):请输入规范的--公司.街道与公司.详细地址!");
            return;
        }
        var pp = local.getResults().getPoi(0).point;
        if (typeof pp == "undefined" || pp == null || pp == "") {
            alert("百度未检索到起点(pp):请输入规范的--公司.街道与公司.详细地址!");
            return;
        }
        console.log(poi);
        console.log(pp);
        G_gsopend.lng = pp.lng;
        G_gsopend.lat = pp.lat;
        map.centerAndZoom(pp, 18);
        map.addOverlay(new BMap.Marker(pp));
        console.log(outi);
        wordgjTwice(fbbbName, outi);
    }

    var local = new BMap.LocalSearch(map, {
        onSearchComplete: myFun
    });
    local.search(sendaaaName);
};

function copyText() {
    G_numi = 1;
    var justtable = $('#dataTable_resume');
    var tab = document.getElementById("dataTable_resume");
    var trnum = tab.rows.length;

    // console.log('trnum',trnum)
    var isEmptyTable = $(document.getElementById("dataTable_resume").rows[1]).html().includes('dataTables_empty')
    if (isEmptyTable) {
        return false;
    }

    var geName = document.getElementById("dataTable_resume").rows[1].cells[2].innerHTML;
    var startCity = document.getElementById('working_place_city').value
    if (typeof startCity == "undefined" || startCity == null || startCity == "") {
        // alert("请输入筛选的--城市!");
        return;
    }
    var startStreet = document.getElementById('working_place_street').value
    if (typeof startStreet == "undefined" || startStreet == null || startStreet == "") {
        // alert("请输入--公司.街道!");
        return;
    }
    var start_suite = document.getElementById('working_place_suite').value
    if (typeof start_suite == "undefined" || start_suite == null || start_suite == "") {
        start_suite = " ";
    }
    var topsoucity = startCity + startStreet + start_suite;

    for (i = 1; i < trnum; i++) {
        var geID = document.getElementById("dataTable_resume").rows[i].cells[0].innerHTML;

        //获得tr的id
        geID = document.getElementById("dataTable_resume").rows[i].id

        var partgeName = document.getElementById("dataTable_resume").rows[i].cells[2].innerHTML;
        var geLocation = localStorage.getItem("cache_ge_location_" + geID); //document.getElementById("dataTable_resume").rows[i].cells[3].innerHTML;
        console.log('geLocation', geLocation)


        console.log('geID', geID)


        console.log('rows[i] id :', document.getElementById("dataTable_resume").rows[i].id)
        console.log('获得 geID:', geID)

        //线上
        geName = partgeName + geLocation;
        console.log('topsoucity', topsoucity)

        console.log('geName', geName)
        console.log('geID', geID)

        wordgjFirst(topsoucity, geName, geID);
        if (i == trnum - 1) {
            var msg = i + "行,数据已处理,起点为[" + topsoucity + "]";
            document.getElementById("littleshowid").innerHTML = msg;
        }
    }
}

var table = $('#dataTable_resume').on('draw.dt', function () {
    console.log('Loadend')
    if (post_selected_value != 0 && [0, 1].includes(filter_status_value)) {
        copyText()
    }
}).DataTable({
    "scrollY": true,
    dom:
        "<'row'      <'col-sm-12 col-md-8'<'row' <'resume_multi ml-3'B><'ml-3'l>>>       <'col-sm-12 col-md-4'f>   >" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    buttons: [
        {
            text: '多选[N]',
            action: function (e, dt, node, config) {
                enable_multi = !enable_multi;
                button_update(dt, node[0], enable_multi);
            }
        },
        //     {text: '全选',
        //    action: function (e, dt, node, config) {
        //      //
        //     if(!enable_multi){
        //       layer.msg('请开启多选');
        //       return false
        //     }
        //
        //
        //
        //    }},
    ],
    "processing": true,
    "serverSide": true,

    "ajax": {
        "url": "/api/resumes/",
        "type": "GET",
        "beforeSend": function (request) {
            request.setRequestHeader("ORDOV-INTERVIEW-ID", interview_selected_value);
            request.setRequestHeader("ORDOV-POST-ID", post_selected_value);
            request.setRequestHeader("ORDOV-RESUME-ID", resume_selected_value);
            request.setRequestHeader("ORDOV-STATUS-ID", filter_status_value);
        },
        "data": function (d) {
            d.degree_id_min = $('#degree_id_min').val();
            d.degree_id_max = $('#degree_id_max').val();
            d.age_id_min = $('#age_id_min').val();
            d.age_id_max = $('#age_id_max').val();
            d.graduate_time_min = $('#graduate_time_start').val();
            d.graduate_time_max = $('#graduate_time_end').val();
            d.gender_id = $('#gender_id').val();
            d.province = $('#working_place_province').val();
            d.city = $('#working_place_city').val();
            d.district = $('#working_place_district').val();
            d.working_place_street = $('#working_place_street').val()
            var list_elements = document.getElementsByClassName("list-group-item active");
            d.status_id = filter_status_value;
            d.post_id = post_selected_value;

            //新字段
            d.hangyeleibie = $('#hangyeleibie').val()
            d.gangweileibie = $('#gangweileibie').val()
            d.gangweijibie = $('#gangweijibie').val()
            d.gangweizuoxi = $('#gangweizuoxi').val()
            d.shebaogongjijin = $('#shebaogongjijin').val()
            d.gangweitezheng = $('#gangweitezheng').val()

            d.hangyeleibie_val = $('#hangyeleibie_val').val()
            d.gangweileibie_val = $('#gangweileibie_val').val()
            d.gangweijibie_val = $('#gangweijibie_val').val()
            d.gangweizuoxi_val = $('#gangweizuoxi_val').val()
            d.shebaogongjijin_val = $('#shebaogongjijin_val').val()
            d.gangweitezheng_val = $('#gangweitezheng_val').val()


            d.xinzidaiyu = $('#xinzidaiyu').val()

        },
        "error": function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            console.log(jqXHR.status);
            console.log(jqXHR.readyState);
            console.log(jqXHR.statusText);
            console.log(textStatus);
            console.log(errorThrown);
            //$('#dataTable_resume tbody').clear()
            if (jqXHR.responseText == JSON.stringify({"detail": "You do not have permission to perform this action."})) {
                layer.msg('没有权限')
            } else {
                layer.msg(jqXHR.responseText)
            }
        }

    },

    "rowCallback": function (row, data) {
        if ($.inArray(data.DT_RowId.toString(), resumes_selected) !== -1) {
            $(row).addClass('selected');
        }

    },

    /* default column 0 to desc ordering, how link 0 with the column id?*/
    "order": [[0, "desc"]],
    "columns": [
        {
            "data": null,
            "visible": false,
            "checkboxes": {},
        },
        {"data": "interview_id", "visible": false},
        {"data": "candidate_id", "visible": false},
        {
            "data": "id",
            "width": "8%", render: function (data, type, row, meta) {
                var val = row.resume_way2 || '智联招聘主投'
                return `<p>${val}</p>`
            }
        }, // resume id
        {
            "data": "newname",
            "width": "1%",
            render: function (data, type, row, meta) {
                return data;
 /*               
                //var url = t_resume_detail_url;
                if (post_selected)
                    return `
<a class="nav-link" href="/manager/resumes/` + row.id + `">` + data + `</a>
`;
                else
                    return `
<a class="nav-link disabled" href="/manager/resumes/` + row.id + `">` + data + `</a>
`;
*/
            }
        },
        // {"data": "expected",
        //   "width": "5%", render: function (data, type, row, meta) {
        //     var val = row.current_settle.substring(row.current_settle.indexOf('省') + 1, row.current_settle.length);
        //     if (val.startsWith("上海市上海市")) {
        //       val = val.substring(3, val.length)
        //     }
        //     return `<p>${val}</p>`
        //   }
        // },
        {
            "data": "current_settle",
            "width": "5%", render: function (data, type, row, meta) {
                localStorage.setItem("cache_ge_location_" + row.id, row.current_settle)
                var val = row.current_settle.substring(row.current_settle.indexOf('省') + 1, row.current_settle.length);
                if (val.startsWith("上海市上海市")) {
                    val = val.substring(3, val.length)
                }

                return `<p>${val}</p>`
            }
        },
        {
            "data": "age",
            "width": "5%", render: function (data, type, row, meta) {
                var val = row.age
                return `<p>${val}</p>`
            }
        },
        {
            "data": "g",
            "width": "5%", render: function (data, type, row, meta) {
                var val = row.graduate_year///row.graduate_time
                return `<p>${val}</p>`
            }
        },
        {"data": "phone_number", "visible": false},
        {"data": "email", "visible": false},
        {
            "data": "degree",
            "width": "5%"
        },
        {
            "data": "school",
            "width": "5%"
        },
        {
            "data": "major",
            "width": "5%"
        },


        {
            "data": "workexp",
            "orderable": false,
            "width": "20%"
        },
        {
            "data": "distance",
            "width": "5%", render: function (data, type, row, meta) {
                var eleid = `distance_${row.id}`
                return `<p id="${eleid}"></p>`
            }
        },
        {
            "data": "lastmod",
            "width": "5%", render: function (data, type, row, meta) {
                var val = row.lastmod ? row.lastmod.substring(0, 10) : '';
                return `<p>${val}</p>`
            }
        },
        {
            "data": "interview_status_name",
            "orderable": false,
            "width": "5%"
        },

        /* ================================================================================ */
        {
            "data": "interview_status",
            "orderable": false,
            "width": "10%",
            render: function (data, type, row, meta) {

                var rollbackBtn = `<button type="button" class="rollback_btn btn btn-sm " iid="` + row.interview_id + `" id="` + row.id + `">回退</button>`;


                
                /* -------------------------------------------------------------------------------- */
                if (filter_status_value == -1) {
                    return `
                <div class="btn-group">
                <button type="button" phone_number="` + row.phone_number + `" interview_status_name="` + row.interview_status_name + `"  interview_status="` + row.interview_status + `" class="stage_two_test btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">拨打电话</button>
                ${rollbackBtn}
                </div>
`;
                } else if (filter_status_value == 0) {
                    return `
                <div class="btn-group">
                <button type="button" interview_status_name="${row.interview_status_name}"  class="stage_one_show btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">显示</button>
               
                <button type="button" iid="${row.interview_id}" class="stage_zero_pass btn btn-sm " id="` + row.id + `">通过</button>
                <button type="button" class="stage_zero_fail btn btn-sm " iid="${row.interview_id}" id="` + row.id + `">简历不符</button>
                <div  class="mapsec" style="width: 200px;height: auto;display:none;background-color: white" id="` + 'aaadiv' + row.id + `">地图初始值11:13</div>
                <div style="display:none;width: 200px;height: auto;background-color: white" id="` + 'bbbdiv' + row.id + `"></div>
                </div>
          `;
                }


                    //以前的通过<button type="button" class="stage_one_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">通过</button>
                    //以前的显示是 stage_one_show
                    //以前是zero fail
                /* -------------------------------------------------------------------------------- */
                else if (filter_status_value == 1) {
                    var _thisClass = 'stage_zero_ai'
                    var fontColor = '#000000e3'
                    if (row.ai_called.includes(post_selected_value)) {
                        fontColor = '#00000030'
                        _thisClass = ''
                    }

                    return `
                <div class="btn-group">
                                <button  style="color: ${fontColor}" iid="` + row.interview_id + `" type="button" class="${_thisClass} btn btn-sm btn_${row.id}" id="` + row.id + `">AI</button>
                                <button iid="` + row.interview_id + `" type="button" class="stage_zero_sms btn btn-sm " id="` + row.id + `">短信</button>
                <button type="button" iid="${row.interview_id}" class="stage_zero_pass btn btn-sm " id="` + row.id + `">通过</button>
                <button type="button" phone_number="` + row.phone_number + `" interview_status_name="` + row.interview_status_name + `"  interview_status="` + row.interview_status + `" is_shaixuan="1" class="stage_two_test btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">显示</button>
                <button type="button" other="buheshi" class="stage_four_fail btn btn-sm " id="${row.interview_id}" data-resume_id="` + row.id + `">结束</button>
                </div>

`;
                }
                    //修改放弃面试按钮:  old:  <button type="button"  class="stage_four_fail btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">放弃面试</button>
                    /* -------------------------------------------------------------------------------- */
                // TBD: Do we need to restore resume_id into DOM data-resume_id in every element?
                else if (filter_status_value == 2) {
                    return `
                <div class="btn-group">
<!--                <button type="button" class="stage_two_dail btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">拨号面试</button>-->
                <button type="button" class="stage_two_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">同意面试</button>
                <button type="button" other="buheshi" class="stage_four_fail btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">放弃面试</button>
                <button type="button" phone_number="` + row.phone_number + `" interview_status_name="` + row.interview_status_name + `"  interview_status="` + row.interview_status + `" class="stage_two_test btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">拨打电话</button>
                                ${rollbackBtn}

                </div>

`;
                }
                    /* -------------------------------------------------------------------------------- */

                    //                <button type="button" class="stage_three_not_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">面试未通过</button>

                    //再次面试修改为，test弹窗的同意面试
                //                <button type="button" class="stage_three_miss btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">面试未到场</button>
                else if (row.interview_status == 3) {//stage_three_fail
                    return `
                <div class="btn-group">
                
                <button type="button" phone_number="` + row.phone_number + `" interview_status_name="` + row.interview_status_name + `"  interview_status="` + row.interview_status + `" class="stage_two_test btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">拨打电话</button>
                <button type="button" class="stage_three_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">面试通过</button>
                 <button type="button" class="stage_four_fail btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">放弃面试</button>
                 <button type="button" class="stage_three_not_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">面试未通过</button>
                 <button type="button" class="stage_two_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">再次面试</button>


${rollbackBtn}
                </div>
`;
                }
                /* -------------------------------------------------------------------------------- */
                else if (row.interview_status == 4) {
                    return `
                <div class="btn-group">
                <button type="button" phone_number="` + row.phone_number + `" interview_status_name="` + row.interview_status_name + `"  interview_status="` + row.interview_status + `" class="stage_two_test btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">拨打电话</button>
                <button type="button" class="stage_four_update btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">待定</button>
                <button type="button" phone_number="` + row.phone_number + `" interview_status_name="` + row.interview_status_name + `"  interview_status="` + row.interview_status + `" class="stage_four_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">同意入职</button>
                <button type="button" class="stage_four_fail btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">放弃入职</button>
                                ${rollbackBtn}
                </div>
`;
                }
                    //修改【更期入职的tap 】stage_five_update
                /* -------------------------------------------------------------------------------- */
                else if (row.interview_status == 5) {
                    return `
                <div class="btn-group">
                <button type="button" phone_number="` + row.phone_number + `" interview_status_name="` + row.interview_status_name + `"  interview_status="` + row.interview_status + `" class="stage_two_test btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">拨打电话</button>
                <button type="button" class="stage_four_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">更期入职</button>
                <button type="button" class="stage_five_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">已入职</button>
                <button type="button" class="stage_five_fail btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">放弃入职</button>
                                ${rollbackBtn}
                </div>
`;
                }
                    /* -------------------------------------------------------------------------------- */
                //未通过考察 原来是 stage_six_fail
                else if (row.interview_status == 6) {
                    return `
                <div class="btn-group">
                <button type="button" phone_number="` + row.phone_number + `" interview_status_name="` + row.interview_status_name + `"  interview_status="` + row.interview_status + `" class="stage_two_test btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">拨打电话</button>
                <button type="button" class="stage_four_fail btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">放弃考察</button>
                <button type="button" class="stage_six_pass btn btn-sm " id="` + row.interview_id + `"  data-resume_id="` + row.id + `">通过考察</button>
                <button type="button" class="stage_six_fail btn btn-sm " id="` + row.interview_id + `"  data-resume_id="` + row.id + `">未通过考察</button>
                                ${rollbackBtn}
                </div>

`;
                }
                /* -------------------------------------------------------------------------------- */
                else if (row.interview_status == 7) {
                    return `
                <div class="btn-group">
                <button type="button" class="stage_seven_register btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">登记</button>
                <button type="button" class="stage_seven_bill btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">发票</button>
                <button type="button" class="stage_seven_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">完成</button>
                <button type="button" class="stage_seven_fail btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">坏账</button>
                                ${rollbackBtn}
                </div>
`;
                }
                  /* -------------------------------------------------------------------------------- */
                  else if (row.interview_status == 8) {
                    return `
                <div class="btn-group">
                <button type="button" phone_number="` + row.phone_number + `" interview_status_name="` + row.interview_status_name + `"  interview_status="` + row.interview_status + `" class="stage_two_test btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">拨打电话</button>
                </div>
`;
                }              

                /* -------------------------------------------------------------------------------- */
                else {
                    return `
                <div class="btn-group">
                    <button type="button" phone_number="` + row.phone_number + `" interview_status_name="` + row.interview_status_name + `"  interview_status="` + row.interview_status + `" class="stage_two_test btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">拨打电话</button>
                    </div>
                    `;
                    // return "流程结束";
                }
            }
        },
    ],
});

/* ================================================================================ */

var table_post = $('#dataTable_post').DataTable({
    "dom": '<"top"i>rt<"bottom"l<"post_search" f>p><"clear">',
    "lengthChange": false,
    "pageLength": 8,
    "pagingType": "simple",
    "processing": false,
    "serverSide": true,

    "scrollX": false,
    "scrollCollapse": false,
    "searching": true,

    "ajax": {
        "url": "/api/posts/",
        "type": "GET",
        "beforeSend": function (request) {
            request.setRequestHeader("ORDOV-INTERVIEW-ID", interview_selected_value);
            request.setRequestHeader("ORDOV-POST-ID", post_selected_value);
            request.setRequestHeader("ORDOV-RESUME-ID", resume_selected_value);
            request.setRequestHeader("ORDOV-STATUS-ID", filter_status_value);
        },
        "error": function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            console.log(jqXHR.status);
            console.log(jqXHR.readyState);
            console.log(jqXHR.statusText);
            console.log(textStatus);
            console.log(errorThrown);
            alert("Sorry, 您没有权限遍历当前项目")
        }

    },

    "rowCallback": function (row, data) {
        if ((post_selected === true) && (data.DT_RowId == post_selected_value)) {
            console.log('add selected')
            $(row).addClass('selected');
        }


    },

    "columns": [
        {
            "data": "project_name", render: function (data, type, row, meta) {
                // console.log(row)

                var name = `${row.department.company.name}-${row.address_city}-${row.name}`

                var btn = row.finished === 0
                    ? `<button id="editProjectBtn" project_id="${row.id}" style="background-color: #beed9e;float:right"  class="btn btn-sm" type="button" >编辑</button><button id="finishProjectBtn" project_id="${row.id}" style="float: right;background-color: #beed9e"  class="btn btn-sm" type="button" >结束</button>`
                    : `<button id="editProjectBtn" project_id="${row.id}" style="background-color: #beed9e;float:right"  class="btn btn-sm" type="button" >编辑</button><button id="unfinishProjectBtn" project_id="${row.id}" style="float: right;background-color: #454545"  class="btn btn-sm" type="button" >已结束</button>`;
                return `<div ><div style="display:inline">
                        ${name}
                </div>
                <div class="finish_project" id="${row.id}" style="z-index: 99" style="display:inline">
                        ${btn}
                </div>
             </div>

`;
            }
        },
    ]
});

setInterval(function () {
    var _this = $('.mapsec');
    var cls = _this.each(function (index) {
        var id = _this.eq(index).attr('id');
        var distance = $('div#' + id + ' div .trans-title').find('p').eq(1).text()
        console.log(id, distance)
        $(`#distance_${id.replace('aaadiv', '')}`).text(distance)
    });
}, 3000)


$(document).on('click', '#finishProjectBtn', function () {
    var project_id = $(this).attr('project_id');
    $.ajax({
        method: "POST",
        url: "/api/dofinish",
        data: {
            id: project_id,
            val: 1
        },
        success: function (response) {
            console.log(response)
            window.location.reload();
        },
    });
    // alert(project_id);
});

$(document).on('click', '#unfinishProjectBtn', function () {
    var project_id = $(this).attr('project_id');
    $.ajax({
        method: "POST",
        url: "/api/dofinish",
        data: {
            id: project_id,
            val: 0
        },
        success: function (response) {
            console.log(response)
            window.location.reload();
        },
    });
    // alert(project_id);
});


//编辑项目
$(document).on('click', '#editProjectBtn', function () {
    var project_id = $(this).attr('project_id');
    window.location.href = "/api/edit_post_page?id=" + project_id
    // $.ajax({
    //   method: "POST",
    //   url: "/api/dofinish",
    //   data: {
    //     id: project_id,
    //   },
    //   success: function (response) {
    //     console.log(response)
    //     window.location.reload();
    //   },
    // });
    // alert(project_id);
});


/* ======================================== Process Begin Here */

$(function () {
    /* flush table every 100s */
    setInterval(flush, 1000);

    function flush() {
        if (post_selected_value > 0 && interview_selected_value == 1) {
            page_refresh(table, true);
        }
    }

    setInterval(function () {
        var needRefresh = localStorage.getItem('needRefresh');
        if (needRefresh && needRefresh == 1) {
            console.log('load')
            page_refresh(table, true);
            localStorage.setItem("needRefresh", "0");
        }
    }, 300)
})

$('#age_id_min, #age_id_max').keyup(function () {
    page_refresh(table, true);
});

$('#working_place_province, #working_place_city, #working_place_district , #working_place_street').keyup(function () {
    page_refresh(table, true);
});
//new frfresh
//change event


$('#hangyeleibie, #gangweileibie, #gangweijibie , #gangweizuoxi, #shebaogongjijin, #gangweitezheng').change(function () {
    page_refresh(table, true);
});

$('#hangyeleibie_val, #gangweileibie_val, #gangweijibie_val , #gangweizuoxi_val, #shebaogongjijin_val, #gangweitezheng_val, #xinzidaiyu').keyup(function () {
    page_refresh(table, true);
});


$('#degree_id_min, #gender_id, #degree_id_max').change(function () {
    page_refresh(table, true);
});

$('#graduate_time_start, #graduate_time_end').change(function () {
    page_refresh(table, true);
});

$('#closeProject').click(function () {
    $('#projectPanel').css('display', 'none')
    $('#mainOpPanel').removeClass('col-md-10')
    $('#mainOpPanel').addClass('col-md-12')
    // show the right arrow in the left side
    $('#projectSelectShow').css('display', 'inline')
});

$('#projectSelectShow').click(function () {
    $('#projectPanel').css('display', 'inline')
    $('#mainOpPanel').removeClass('col-md-12')
    $('#mainOpPanel').addClass('col-md-10')
    // show the right arrow in the left side
    $('#projectSelectShow').css('display', 'none')
});

$('.list-group-item').on('click', function (e) {
    filter_status_value = this.value;
    localStorage.setItem("reset_refresh", "1");
    page_refresh(table, true);
    if (filter_status_value >= 2) {
        $('#queryform').hide()
        $('.dataTables_scrollBody').height(500)
        // $('#modcol').hide()
    } else {
        $('#queryform').show()
        $('.dataTables_scrollBody').height(350)
        // $('#modcol').show()
    }
});

$('#table_Status').on('click', function (e) {
    if (post_selected == false) {
        alert("请先选择职位.");
        e.stopPropagation();
    } else {
        $('#ai_status').val('-')
        $('#ai_status_action').val('-')
        $('#ai_status_and_action').val('-')
        $('#aiSelectModal').modal('toggle')
    }
});

$('#ai_status_action').on('change', function (e) {
    var newStr = "对于AI状态: " + $('#ai_status').val() + " 的记录," + "作" + $('#ai_status_action').val() + "处理"
    console.log(newStr)
    $('#ai_status_and_action').val(newStr)
});

$('#aiStatusActionSubmit').on('click', function (e) {
    var post_id = post_selected_value
    $.ajax({
        method: "POST",
        url: "/interview/ai/update/",
        data: {
            post_id: post_id,
            ai_status: $('#ai_status').val(),
            ai_status_action: $('#ai_status_action').val(),
        },
        success: function (response) {
            page_refresh(table, false);
            $('#ai_status').val('-')
            $('#ai_status_action').val('-')
            $('#ai_status_and_action').val('done!')
        },
    });
});

function format(d) {
    var data = format_inner(d)
    var sData = JSON.parse(data)
    return '<div class=".container">' +
        '<div class="row">' +
        '<div class="col-md-2">' +
        '</div>' +
        '<div class="col-md-2">' +
        '<p style="display:inline;">' + "籍贯:" + '</p>' +
        '<p style="display:inline;">' + sData.birthorigin + '</p>' +
        '</div>' +
        '<div class="col-md-2">' +
        '<p style="display:inline;">' + "电话:" + '</p>' +
        '<p style="display:inline;">' + sData.phone_number + '</p>' +
        '</div>' +
        '<div class="col-md-4">' +
        '<p style="display:inline;">' + "毕业时间:" + '</p>' +
        '<p style="display:inline;">' + sData.graduate_time + '</p>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-2">' +
        '</div>' +
        '<div class="col-md-2">' +
        '</div>' +
        '<div class="col-md-8">' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-2">' +
        '</div>' +
        '<div class="col-md-2">' +
        '<span>' + "现工作地:" + '</span>' +
        '</div>' +
        '<div class="col-md-8">' +
        '<span>' + "--" + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-2">' +
        '</div>' +
        '<div class="col-md-2">' +
        '<span>' + "期望工作地点:" + '</span>' +
        '</div>' +
        '<div class="col-md-8">' +
        '<span>' + sData.expected + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-2">' +
        '</div>' +
        '<div class="col-md-2">' +
        '<span>' + "期望岗位类型:" + '</span>' +
        '</div>' +
        '<div class="col-md-8">' +
        '<span>' + "--" + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-2">' +
        '</div>' +
        '<div class="col-md-2">' +
        '<span>' + "期望薪资:" + '</span>' +
        '</div>' +
        '<div class="col-md-8">' +
        '<span>' + "--" + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-2">' +
        '</div>' +
        '<div class="col-md-2">' +
        '<span>' + "最近一份工作经历:" + '</span>' +
        '</div>' +
        '<div class="col-md-8">' +
        '<span>' + sData.workexp + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-2">' +
        '</div>' +
        '<div class="col-md-2">' +
        '<span>' + "最高学历:" + '</span>' +
        '</div>' +
        '<div class="col-md-8">' +
        '<span>' + sData.school + ' ' + sData.major + ' ' + sData.degree + '</span>' +
        '</div>' +
        '</div>' +
        '</div>';
};

function format_inner(d) {
    var resume_id = d.id
    return $.ajax({
        url: '/api/resumes/' + resume_id + '/',
        type: 'GET',
        "beforeSend": function (request) {
            request.setRequestHeader("ORDOV-INTERVIEW-ID", interview_selected_value);
            request.setRequestHeader("ORDOV-POST-ID", post_selected_value);
            request.setRequestHeader("ORDOV-RESUME-ID", resume_selected_value);
            request.setRequestHeader("ORDOV-STATUS-ID", filter_status_value);
        },
        data: null,
        async: false
    }).responseText;
};

// resume table
$('#dataTable_resume tbody').on('click', 'tr', function (e) {
    if (post_selected == false) {
        //alert("Please select Post first.");
        alert("请先选择职位.");
        e.stopPropagation();
    } else {
        // All interactive elements should be excluded here.
        if ($(e.target).hasClass('btn')) {
            return;
        }

        if (enable_multi) {
            console.log('多选')
            // Multiple Selection
            var id = this.id;
            var interview_id = -1;
            try {
                // TBD: more gerneric and accurate way to get interview_id
                interview_id = this.lastChild.firstElementChild.firstElementChild.id;
                if (interview_id === "")
                    interview_id = -1;
            } catch {
                interview_id = -1;
            }

            var index = $.inArray(id, resumes_selected);

            if (index === -1) {
                resumes_selected.push(id);

                if (interview_id >= 0)
                    interviews_selected.push(interview_id);
            } else {
                resumes_selected.splice(index, 1);

                if (interview_id >= 0)
                    interviews_selected.splice(index, 1);
            }

            $(this).toggleClass('selected');
        } else { // not enable_multi
            var tr = $(this).closest('tr')
            var row = table.row(tr)
            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown')
            } else {
                // Open this row
                // row.child(format(row.data())).show();
                // row.child(format(row.data())).show()
                // tr.addClass('shown')
            }
        }
    }
});

function page_refresh(table, reset_flag = false) {
    /*
        Shoud Never call xhr_common_send in xhr_common_send
     */
    if (post_selected_value < 0) {
        return
    }

    $.ajax({
        url: "/manager/resumes/statistic/" + post_selected_value + "/",
        type: 'GET',
        "beforeSend": function (request) {
            request.setRequestHeader("ORDOV-INTERVIEW-ID", interview_selected_value);
            request.setRequestHeader("ORDOV-POST-ID", post_selected_value);
            request.setRequestHeader("ORDOV-RESUME-ID", resume_selected_value);
            request.setRequestHeader("ORDOV-STATUS-ID", filter_status_value);
        },
        data: null,
        success: function (response) {
            document.getElementById("badge_statistic_stage_0").innerHTML = response.resumes_waitting;
            for (var i = 1; i <= response.interviews_status_filters.length; i++) {
                document.getElementById("badge_statistic_stage_" + i).innerHTML = response.interviews_status_filters[i - 1];
            }
        }
    });

    empty_multi_selection();
    enable_multi = false;

    // WTF? So many 0s... the first buttons's first child, there're two API:
    // containers() and container(), I can't distinguish them since both of them need to get [0]
    console.log('切换')

    button_container = table.buttons().container()[0].children[0];
    redrawed = button_update(table, button_container, enable_multi, reset_flag);

    if (!redrawed) {
        table.draw(reset_flag);
    }
}

function xhr_common_send(method, url, data, succCallback = null, needRefresh = true) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    xhr.setRequestHeader('ORDOV-INTERVIEW-ID', interview_selected_value);
    xhr.setRequestHeader('ORDOV-POST-ID', post_selected_value);
    xhr.setRequestHeader('ORDOV-RESUME-ID', resume_selected_value);
    xhr.setRequestHeader('ORDOV-STATUS-ID', filter_status_value);

    var csrftoken = getCookie('csrftoken');

    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    console.log("------------------------------------>")

    xhr.onloadend = function () {
        console.log('xhr.onloadend ')
        //done
        if (needRefresh) {
            page_refresh(table);
        }
    };

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) { //if complete
            // 2xx is ok, ref: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
            if (xhr.status >= 200 && xhr.status < 300) {
                if (succCallback) {
                    succCallback(JSON.parse(xhr.response))
                }
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

function create_interview(resume_id, post_id, url, status_value, sub_status, is_active = true, succCallback = null, needRefresh = true) {
    data = {
        "resume": resume_id,
        "post": post_id,
        "is_active": is_active,
        "status": status_value,
        "sub_status": sub_status,
        "result": is_active ? "Pending" : "Stopped",
    };

    /* POST: create the new item */
    xhr_common_send("POST", url, data, succCallback,needRefresh);
}

function stop_interview(interview_id, resume_id, post_id, url, status_value, sub_status, is_active = false) {
    data = {
        "resume": resume_id,
        "post": post_id,
        "is_active": is_active,
        "status": status_value,
        "sub_status": sub_status,
        "result": is_active ? "Pending" : "Stopped",
    };

    /* POST: create the new item */
    xhr_common_send("PATCH", url + interview_id + '/', data);
}

// short-cut for xx-by_compound
function submit_interview_by_id(interview_id, url, status_value, sub_status, succCallback) {
    data = {
        "is_active": true,
        "status": status_value,
        "post": post_selected_value,
        "result": "Pending",
        "sub_status": sub_status,
    };

    xhr_common_send("PATCH", url + interview_id + '/', data, succCallback);
}

/* Save Interview Sub Table */
function create_interviewsub_info(url, table, data) {
    xhr_common_send("POST", url, data);
}

/* Save Interview Sub Table */
function create_interviewsub_info_test(url, table, data) {
    xhr_common_send("GET", url, data);
}


function helper_get_selectbox_text(select_id) {
    console.log("id: ", select_id)
    select_box = document.getElementById(select_id);
    text_box = select_box.options[select_box.selectedIndex].innerHTML;

    return text_box;
}

function helper_get_textbox_text(text_id) {
    text_box = document.getElementById(text_id);
    if (text_box != null) {
        return text_box.value;
    }
    return ""
}


function show_post_modal(post_id, callback) {
    xhr_common_send('GET', '/api/posts/' + post_id + '/', null, function (response) {
        /* here the abbreviation is not work, don't know why. Since the getElementbyid method is the most effience one, use it. */
        //$('#text_postinfo_company').value = response.department.company.name;
        //document.querySelector('#text_postinfo_company').value = response.department.company.name;
        document.getElementById("text_postinfo_company").value = response.department.company.name;
        document.getElementById("text_postinfo_department").value = response.department.name;
        document.getElementById("text_postinfo_post").value = response.name;
        document.getElementById("text_postinfo_description").value = response.description;


    })
}

function show_ai_config_modal(resume_id) {
    xhr_common_send('GET', '/api/posts/' + post_selected_value + '/', null, function (response) {
        document.getElementById("config_ai_task_name").value = response.baiying_task_name;
    },false)
    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        document.getElementById("text_name").value = response.username;
        document.getElementById("text_phone_number").value = response.phone_number;
        // $('#dialModal').modal('toggle');
        multisel_submit_wrapper_resumeid(do_dial_submit);

    },false)
}

function show_resume_modal(resume_id, callback) {
    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        /*
        document.getElementById("candidate_text_resumeinfo_username").value = response.username;
        document.getElementById("candidate_text_resumeinfo_degree").value = response.degree;
        document.getElementById("candidate_text_resumeinfo_school").value = response.school;
        document.getElementById("candidate_text_resumeinfo_phone_number").value = response.phone_number;
        */
    })
}

function show_callCandidate_modal(post_id, resume_id) {
    show_post_modal(post_id, false);
    show_resume_modal(resume_id, false);
    // TBD: no error handler
    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        console.log("response", response)
        /*
    document.getElementById("dail_text_expected_salary").value = response.expected_salary;
    document.getElementById("dail_text_expected_place_province").value = response.expected_province;
    document.getElementById("dail_text_expected_place_city").value = response.expected_city;
    document.getElementById("dail_text_expected_place_district").value = response.expected_district;
    document.getElementById("dail_text_expected_place_street").value = response.expected_street;
    */
        //document.getElementById("").value = response.phone_number;
    })
    $('#dailToCandidateModal').modal('toggle');
    //$('#myModal').modal('toggle');
}


///SHOW AI
function show_ai_info(resume_id, post_id) {

    xhr_common_send('GET', "/interview/ai/info?resume_id=" + resume_id + "&post_id=" + post_id, null, function (response) {
        console.log("success: ", response)
        console.log(response.phoneLogs)
        $('#ai_result_panel').val(response.phoneLogs)
        $('#ai_result_duration').text(response.phoneDuration)
        $('#ai_result_projname').text(response.phoneJobName)
        $('#ai_result_tag').text(response.phoneTags)
        $('#aiResult').modal('toggle')
    })
}

function show_stop_modal(interview_id, resume_id) {
    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        document.getElementById("text_terminate_expected_province").value = response.expected_province;
        document.getElementById("text_terminate_expected_city").value = response.expected_city;
        document.getElementById("text_terminate_expected_district").value = response.expected_district;
    })
    $('#stopModal').modal('toggle')
}

function show_entry_update_modal(interview_id) {
    xhr_common_send('GET', '/interviews/sub/offer/' + interview_id + '/', null, function (response) {
        document.getElementById("text_entryupdate_date").value = response.date;
        document.getElementById("text_entryupdate_contact").value = response.contact;
        document.getElementById("text_entryupdate_contact_phone").value = response.contact_phone;
        document.getElementById("text_entryupdate_address").value = response.address;
        document.getElementById("text_entryupdate_postname").value = response.postname;
        document.getElementById("text_entryupdate_certification").value = response.certification;
        document.getElementById("text_entryupdate_salary").value = response.salary;
        document.getElementById("text_entryupdate_notes").value = response.notes;
        $('#entryUpdateModal').modal('toggle');
    })
}

// ================================= CLICKS ===============================================
function tmp_not_support_multi() {
    if (enable_multi)
        alert("This button not support multi-sel event yet!");
}

function multisel_submit_wrapper(callback) {
    if (!enable_multi) {
        callback(interview_selected_value);
    } else {
        for (var i = 0; i < interviews_selected.length; i++) {
            callback(interviews_selected[i]);
        }
    }
}

function multisel_submit_wrapper_resumeid(callback) {
    if (!enable_multi) {
        callback(resume_selected_value);
    } else {
        for (var i = 0; i < resumes_selected.length; i++) {
            callback(resumes_selected[i]);
        }
    }
}

function do_common_plain_submit(interview_id, modal_name, status, sub_status) {
    $(modal_name).modal('hide');
    submit_interview_by_id(interview_id, "/api/interviews/", status, sub_status);
}

$(document).on('click', '.invite_button', function () {
    resume_selected_value = Number(this.id);
    alert(resume_selected_value);
    tmp_not_support_multi();
});

$(document).on('click', '.stage_zero_ai', function () {
    var project_info = JSON.parse(localStorage.getItem("project_info"));
    if(project_info.baiying_task_name == ''){
        layer.msg('百应任务为空.呼叫失败');
        return false
    }


    resume_selected_value = Number(this.id);

    console.log('iid=' , this.iid)
    // return false

    if (!this.iid || this.iid == 'null') {
        console.log(1)
        create_interview(resume_selected_value, post_selected_value, "/api/interviews/", 1, '筛选', true, function (res) {
            // interview_selected_value = res.id//localStorage.getItem("interview_selected_value")
            //修改为直接触发 不需要确认
            show_ai_config_modal(resume_selected_value);
            layer.msg('操作成功')
        },false)
    } else {
                console.log(2)
        //修改为直接触发 不需要确认
        show_ai_config_modal(resume_selected_value);
        layer.msg('操作成功')
    }


});

// TBD: ?
$(document).on('click', '.stage_zero_sms', function () {
});


function chat_wechat(resumeId, interviewId) {
    if (!interviewId || interviewId == 'null') {
        create_interview(resumeId, post_selected_value, "/api/interviews/", 2, '微信沟通', true, function (res) {
            layer.msg('操作成功')
            setTimeout(function () {
                layer.closeAll()
            }, 500)
        });
    } else {
        submitInterviewById(interviewId, "/api/interviews/", 2, '微信沟通')
        layer.msg('操作成功')
        setTimeout(function () {
            layer.closeAll()
        }, 500)
    }
}


/*
  About multiple selection
  If the element is for POPUP MODAL, then leave it unchanged.
  If the element is for SUBMIT, then use the multisel* wrapper.
 */
function do_stage_zero_pass(resume_id, iid) {
    if (!iid || iid == 'null') {
        create_interview(resume_id, post_selected_value, "/api/interviews/", 2, '邀约', true, function (res) {
            layer.msg('操作成功')
            setTimeout(function () {
                layer.closeAll()
            }, 500)
        });
    } else {
        submitInterviewById(iid, "/api/interviews/", 2, '邀约')
        layer.msg('操作成功')
        setTimeout(function () {
            layer.closeAll()
        }, 500)
    }
}


//回退按钮，可以到任意状态


function rollback_btn() {
    resume_id = localStorage.getItem("resume_id")
    // var post_selected_value = localStorage.getItem("test_box_useprojectid");
    interview_selected_value = localStorage.getItem("interview_selected_value")
    iid = interview_selected_value

    $('#rollback_div').modal('toggle');

}

$(document).on('click', '.rollback_btn', function () {
    console.log(this)
    iid = Number($(this).attr('iid'))
    resume_selected_value = Number(this.id);
    $('#rollback_div').modal('toggle');
});


//拒绝、放弃

function resumeLog(resume, col, val = '') {
    //if(['expected_industry','expected_post'].includes(col)){}
   // else if (val == '' && !['not','weilianxishang','haomacuowu'].includes(col)) {
    ///     return false
   // }
    $.ajax({
        method: "POST",
        url: "/api/opresumelog",
        async: false,
        data: {
            resume,
            col,
            val,
            'post_id': post_selected_value
        },
        success: function (response) {
            console.log(response)
            // window.location.reload();
        },
    });
}


function UpdateBasicInfo(rid, p = '', c = '', d = '', s = '') {
    rid = rid || resumeId
    // Parsing the basic info and update
    var cache = JSON.parse(localStorage.getItem("box_reusme_info"));

    var data = {
        // username: cache.username,
        // age: cache.age,
        // gender: cache.gender,
        // degree: cache.degree,
        current_settle_province: p,
        current_settle_city: c,
        current_settle_district: d,
        current_settle_street: s,
        // expected_province: cache.expected_province,
        // expected_city: cache.expected_city,
        // expected_district: cache.expected_district,
    }


    console.log("Prepare to update the resume Info data:", data)
    xhr_common_send('PUT', '/api/resumes/' + rid + '/', data, function (response) {
        // console.log("success update resume Info")
        box_resume_info(rid)
    })
}


function submitInterviewById(interview_id, url, status_value, sub_status, result = "Pending", is_active = true) {
    var data = {
        "is_active": is_active,
        "status": status_value,
        "post": post_selected_value,
        "result": result,
        "sub_status": sub_status,
    };

    xhr_common_send("PATCH", url + interview_id + '/', data);
}

function submitInterviewById1(interview_id, url, status_value, sub_status, result = "Pending", is_active = true) {
    var data = {
        "is_active": is_active,
        "status": status_value,
        "post": post_selected_value,
        "result": result,
        "sub_status": sub_status,
    };

    xhr_common_send("PATCH", url + interview_id + '/', data);
}


//特殊拒绝
function otherRejectSubmit(value, reason, resumeId, interviewId) {
    resumeLog(localStorage.getItem("resume_id"), value, "")
    //2020年04月17日15:12:05，未联系上不设置状态
    // submitInterviewById(localStorage.getItem("interview_selected_value"), "/api/interviews/", 8, reason, "Stopped", false);

    //2020年4月29日 15:24:27 修改状态  filter_status_value
    // submitInterviewById(localStorage.getItem("interview_selected_value"), "/api/interviews/", 8, reason, "Stopped", false);
    if (!interviewId || interviewId == 'null') {
        create_interview(resumeId, post_selected_value, "/api/interviews/", filter_status_value, reason, true, function (res) {
            layer.msg('操作成功')
            setTimeout(function () {
                layer.closeAll()
            }, 500)
        });
    } else {
        submitInterviewById(interviewId, "/api/interviews/", filter_status_value, reason)
        layer.msg('操作成功')
        setTimeout(function () {
            layer.closeAll()
        }, 500)
    }

    // layer.closeAll()
    // layer.msg('操作成功')
}

$(document).on('click', '#rejectFormSubmit', function () {
    var forward = $('#forward').val();
    var value = $("input[name=reject_option]:checked").val();

    var statusMap = {
        0: '简历筛选',
        1: '筛选',
        2: '邀约',
        3: '面试',
        4: 'OFFER',
        5: '入职',
        6: '考察',
        7: '回款',
        8: '完成',
        9: '不合适',
    };
    var tag_start = statusMap[filter_status_value]
    var tag_end = $("input[name=reject_option]:checked").next().text()
    var reason = tag_start + '-' + tag_end

    console.log('查看选中的value', value)
    var isNone = true;

    //地址处理
    if (value == 'muqianjuzhudi') {
        console.log('value=1')
        var shen = $("#province_id").find("option:selected").text()
        var shi = $("#city_id").find("option:selected").text()
        var qu = $("#district_id").find("option:selected").text()
        var jiedao = $("#street_id").find("option:selected").text()

        forward = `${shen || ''}${shi || ''}${qu || ''}${jiedao || ''}`
        isNone = false;
        //保存到简历的个人信息
        UpdateBasicInfo(resume_id, shen, shi, qu, jiedao)
        resumeLog(resume_id, value, forward)
    } else if (value == 'expected_industry') {
        console.log('value=2')

        //这两个特殊处理，需要遍历
        var strArr = $('#hangyeleibie').val().split('|')
        for (var s of strArr) {
            if (s != '' && hangye_obj[s]) {
                isNone = false;
                console.log(hangye_obj[s], s)
                resumeLog(resume_id, value, hangye_obj[s])
            }
        }
    } else if (value == 'expected_post') {
        console.log('value=3')

        var strArr1 = $('#gangweileibie').val().split('|')
        for (var s of strArr1) {
            if (s != '' && gangwei_obj[s]) {
                isNone = false;
                console.log(gangwei_obj[s], s)
                resumeLog(resume_id, value, gangwei_obj[s])
            }
        }

    } else {
        isNone = false;
        console.log('value=4')
        resumeLog(resume_id, value, forward)
    }

    if(isNone){    
        console.log('value=5')    
        resumeLog(resume_id, value, forward)
    }

    // return false


    //post_id
    console.log('post_selected_value:', post_selected_value)

    if (!interview_selected_value || interview_selected_value == 'null' || isNaN(interview_selected_value)) {
        create_interview(resume_id, post_selected_value, "/api/interviews/", 2, '邀约', true, function (res) {
            //特殊处理筛选环节的结束
            submitInterviewById1(res.id, "/api/interviews/", 8, reason, "Stopped", false);


            $('#reject_div').modal('hide');
            $(window.parent.document).contents().find("#reject_div").modal('hide');
            $('#reject_div').hide()

            //table
            setTimeout(function () {
                page_refresh(table, false)
            }, 300)

            layer.msg('操作成功')
            layer.closeAll()

        });
    } else {
        //特殊处理筛选环节的结束
        submitInterviewById1(interview_selected_value, "/api/interviews/", 8, reason, "Stopped", false);

        layer.closeAll()


        $('#reject_div').modal('hide');
        $(window.parent.document).contents().find("#reject_div").modal('hide');
        $('#reject_div').hide()

        //table
        setTimeout(function () {
            page_refresh(table, false)
        }, 300)

        layer.msg('操作成功')
    }




});

$(document).on('click', '#rollbackFormSubmit', function () {
    var tap = $('#tap').val()
    if (tap == '') {
        layer.msg('请选择状态');
        return false;
    }

    //map
    var statusMap = {
        1: '筛选',
        2: '邀约',
        3: '面试',
        4: 'OFFER',
        5: '入职',
        6: '考察',
        7: '回款',
        8: '完成',
        9: '不合适',
    };

    var interview_id = iid
    if (!interview_id) {
        layer.msg('简历操作不存在')
        return false;
        // create_interview(resume_id, post_selected_value, "/api/interviews/", 2, '邀约');
        // setTimeout(function () {
        //   submit_interview_by_id(interview_id, "/api/interviews/", Number(tap), '测试');
        // }, 500)
    } else {
        if (false && resumes_selected.length > 0) {
            for (var i = 0; i < resumes_selected.length; i++) {
                console.log(resumes_selected)
                // callback(resumes_selected[i]);
                //      submit_interview_by_id(interview_id, "/api/interviews/", Number(tap), statusMap[tap])

            }
        } else {
            submit_interview_by_id(interview_id, "/api/interviews/", Number(tap), statusMap[tap])
        }

        // submit_interview_by_id(interview_id, "/api/interviews/", Number(tap), statusMap[tap]);
    }


    // switch (Number(tap)) {
    //   case 0:
    //     create_interview(resume_id, post_selected_value, "/api/interviews/", 0, "初选-终止", false);
    //     break;
    //   case 1:
    //     break;
    //   case 2:
    //     multisel_submit_wrapper_resumeid(do_stage_zero_pass);
    //     break;
    //   case 3:
    //     multisel_submit_wrapper(do_appointment_submit);
    //     break;
    //   case 4:
    // multisel_submit_wrapper(do_offerInfo_submit);
    //
    //     break;
    //   case 5:
    //
    //     break;
    //   case 6:
    //
    //     break;
    //   case 7:
    //
    //     break;
    //   case 8:
    //
    //
    //     break;
    //   case 9:
    //     break;
    //   default:
    //
    // }
    $('#rollback_div').modal('hide');
});


$(document).on('click', '.stage_zero_pass', function () {
    resume_selected_value = Number(this.id);
    var iid = $(this).attr('iid')
    do_stage_zero_pass(resume_selected_value, iid)
});

function do_stage_zero_fail(resume_id, iid) {
    resume_selected_value = Number(this.id)
    var statusMap = {
        0: '简历筛选',
        1: '筛选',
        2: '邀约'
    };
    var txtMap = {
        0: '简历不符',
        1: '结束',
        2: '放弃面试'
    }
    //判断interviewid
    if (!iid || iid == 'null') {
        create_interview(resume_id, post_selected_value, "/api/interviews/", 8, statusMap[filter_status_value] + '-' + txtMap[filter_status_value], false, function (res) {
            layer.msg('操作成功')
        });
    } else {
        submitInterviewById(iid, "/api/interviews/", 8, statusMap[filter_status_value] + '-' + txtMap[filter_status_value], "Pending", false);
        layer.msg('操作成功')
    }
}

$(document).on('click', '.stage_zero_fail', function () {
    resume_selected_value = Number(this.id);
    iid = $(this).attr('iid')
    do_stage_zero_fail(resume_selected_value, iid)
});

function stage_one_pass() {
    resume_id = localStorage.getItem("resume_id")
    interview_selected_value = localStorage.getItem("interview_selected_value")
    do_next_submit(interview_selected_value)
    layer.msg('操作成功')
}

$(document).on('click', '.stage_one_pass', function () {
    interview_selected_value = Number(this.id);
    // $('#nextModal').modal('toggle')

    multisel_submit_wrapper(do_next_submit);
    layer.msg('操作成功')
});

$(document).on('click', '.stage_one_show', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    var interview_status_name = $(this).attr('interview_status_name');
    console.log(interview_status_name)
    if (interview_status_name && interview_status_name.startsWith('Never call AI before')) {
        layer.msg('AI未呼叫')
        return false;
    }
    show_ai_info(resume_selected_value, post_selected_value)
});

$(document).on('click', '.stage_one_fail', function () {
    interview_selected_value = Number(this.id);
    resume_id = this.dataset.resume_id;
    resume_selected_value = Number(this.dataset.resume_id)
    //show_stop_modal(interview_selected_value, resume_id)
    show_callCandidate_modal(post_selected_value, resume_id);
});

$(document).on('click', '.stage_two_test', function () {

    interview_selected_value = Number(this.id);
    resume_id = this.dataset.resume_id;
    resume_selected_value = Number(this.dataset.resume_id)


    //获得参数
    var is_shaixuan = $(this).attr('is_shaixuan')
    console.log($(this))
    console.log('is_shaixuan', is_shaixuan)
    if (is_shaixuan && is_shaixuan == 1) {
        localStorage.setItem("is_shaixuan", "1")
    } else {
        localStorage.setItem("is_shaixuan", "0")
    }

    var phone_number = $(this).attr('phone_number');
    if (!phone_number || phone_number.length != 11) {
        layer.msg('简历手机号格式错误');
        // return false
    }


    //设置当前进度
    var isname = $(this).attr('interview_status_name');
    localStorage.setItem("now_interview_status_name", isname);

    //修改 因为现在是特殊判断邀约环节了
    localStorage.setItem("now_interview_status", filter_status_value)//$(this).attr('interview_status'))


    localStorage.setItem("resume_id", resume_id);
    localStorage.setItem("post_selected_value", post_selected_value);

    console.log('interview_selected_value = ', interview_selected_value)

    if (!interview_selected_value || interview_selected_value == 'null' || isNaN(interview_selected_value)) {
        console.log(1)
        // create_interview(resume_id, post_selected_value, "/api/interviews/", 2, '邀约', true, function (res) {
        //   interview_selected_value = res.id//localStorage.getItem("interview_selected_value")

        localStorage.setItem("interview_selected_value", "");


        var url = "callInterview?resume_id=" + resume_id +
            "&project_id=" + post_selected_value +
            "&interview_id=" + interview_selected_value +
            "&stage_id=2";
        xadmin.open('标题', url)

        // });
    } else {
        console.log(2)
        localStorage.setItem("interview_selected_value", interview_selected_value);


        var url = "callInterview?resume_id=" + resume_id +
            "&project_id=" + post_selected_value +
            "&interview_id=" + interview_selected_value +
            "&stage_id=2";
        xadmin.open('标题', url)

    }


    // console.log(this)
    // alert(isname)


});

$(document).on('click', '.stage_two_dail', function () {
    interview_selected_value = Number(this.id);
    resume_id = this.dataset.resume_id;
    resume_selected_value = Number(this.dataset.resume_id)
    show_callCandidate_modal(post_selected_value, resume_id);
});


//改过逻辑了，打卡窗口自动创建interviewId
function stage_two_pass(resumeId , iid) {
    // resume_id = localStorage.getItem("resume_id")
    // var post_selected_value = localStorage.getItem("test_box_useprojectid");

    // console.log('stage_two_pass , resume_id=  ' , resume_id)
    // create_interview(rid || Number(resume_id), post_selected_value, "/api/interviews/", 2, '邀约', true, function (res) {
    //   interview_selected_value = res.id//localStorage.getItem("interview_selected_value")
    console.log('iframe 的 resumeId = ' , resumeId)
    // again(interviewId)
    // });

    resume_selected_value = resumeId
    if (!iid || iid == 'null' || isNaN(iid)) {
        create_interview(resume_selected_value, post_selected_value, "/api/interviews/", 2, '邀约', true, function (res) {
            interview_selected_value = res.id//localStorage.getItem("interview_selected_value")

            localStorage.setItem("muti_interview_selected_value", interview_selected_value)
            // This is a popup
            // $('#appointmentModal').modal('toggle')

            //切换成发短信框
            again(interview_selected_value)
        });
    } else {
        again(iid)
    }


}

$(document).on('click', '.stage_two_pass', function () {
    //console.log(this.dataset);
    resume_id = Number(this.dataset.resume_id)
    localStorage.setItem("resume_id", resume_id)
    console.log(resume_id);
    resume_selected_value = Number(this.interview_id)
    if (!this.id || this.id == 'null') {
        console.log("111111");
        //var post_selected_value = localStorage.getItem("test_box_useprojectid");
        var project_info = JSON.parse(localStorage.getItem('project_info'));
        var post_selected_value = project_info.id;
        var resume_selected_value = Number(this.dataset.resume_id);
        create_interview(resume_selected_value, post_selected_value, "/api/interviews/", 2, '邀约', true, function (res) {
            interview_selected_value = res.id//localStorage.getItem("interview_selected_value")
           // interview_selected_value = resume_selected_value
            localStorage.setItem("muti_interview_selected_value", interview_selected_value)
            // This is a popup
            // $('#appointmentModal').modal('toggle')

            //切换成发短信框
            again(interview_selected_value)
        });
    } else {
        console.log("222222");
        /*
        create_interview(resume_selected_value, post_selected_value, "/api/interviews/", 2, '再次面试', true, function (res) {
            interview_selected_value = res.id//localStorage.getItem("interview_selected_value")
           // interview_selected_value = resume_selected_value
            localStorage.setItem("muti_interview_selected_value", interview_selected_value)
            // This is a popup
            // $('#appointmentModal').modal('toggle')

            //切换成发短信框
            again(interview_selected_value)
        });
        */
        again(this.id)
       //again(this.dataset.resume_id)
    }


});

function again(_this_interview_value) {
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
/*
    xhr_common_send('GET', '/api/resumes/' + _this_interview_value + '/', null, function (response) {
        localStorage.setItem("box_reusme_info", JSON.stringify(response))
    });
*/
var resume_id = localStorage.getItem('resume_id');
    $.ajax({
        method: "GET",
        url: '/api/resumes/' + resume_id + '/',
        success: function (response) {
            localStorage.setItem("reusme_info_username", response.username)
            console.log(response.username);
            localStorage.setItem("reusme_info_phone_number", response.phone_number)
            console.log(response.phone_number);
  //  box_resume_info(_this_interview_value)
    //加载初始数据
   // var resume_info = JSON.parse(localStorage.getItem('box_resume_info'));
  //  console.log(localStorage.getItem('box_resume_info'));
    var project_info = JSON.parse(localStorage.getItem('project_info'));

    var tel = localStorage.getItem('reusme_info_phone_number');
    var name = localStorage.getItem('reusme_info_username');
    var hr_name = project_info.link.substring(0, project_info.link.indexOf('('));
    var hr_tel = project_info.link.substring(project_info.link.indexOf('(') + 1, project_info.link.indexOf(')'));
    var hr_place = project_info.place;
    $('#name').val(name);

    //包装选择地址时的变更联系人和电话
    var addrTelMap = {
        [hr_place]: [hr_name, hr_tel]
    }
     // console.log(project_info.extra_address,project_info.extra_address)
    var place_opts = `<option selected value="${hr_place}">${hr_place}</option>`
    if (project_info.extra_address && project_info.extra_address != '') {
        var address_province = project_info.address_province || ''
        var address_city = project_info.address_city || ''
        var base_addr = address_province + address_city
        var extra_address = JSON.parse(project_info.extra_address)
        for (var extra of extra_address) {
            place_opts += `<option value="${base_addr}${extra.district_id}${extra.street_id}${extra.address_suite}">${base_addr}${extra.district_id}${extra.street_id}${extra.address_suite}</option>`
            //添加街道 和 具体地址
            addrTelMap[base_addr + extra.district_id + extra.street_id + extra.address_suite] = [extra.linkman_name, extra.linkman_phone]
        }
    }

    localStorage.setItem("addrTelMap", JSON.stringify(addrTelMap))


    // <input id="text_appointment_address1" type="text" name="text" required lay-verify="required" value="${hr_place}" disabled placeholder="" autocomplete="off" class="layui-input">


    localStorage.setItem("_this_interview_value", _this_interview_value)

    //确认框发短信
    layer.open({
        type: 1,
        // closeBtn: 1,
        skin: 'layui-layer-rim', //加上边框
        area: ['540px', '650px'], //宽高
        content: `<form style="
    padding-left: 100px;
    padding-top: 20px;
    padding-bottom: 80px;
"<div class="layui-form" action="">
  <div class="layui-form-item">
    <label class="layui-form-label">姓名</label>
    <div class="layui-input-inline">
      <input id="name" type="text" name="text" required  lay-verify="required" disabled value="${name}" placeholder="" autocomplete="off" class="layui-input">
    </div>
  </div>
  <div class="layui-form-item">
  <label class="layui-form-label">电话</label>
  <div class="layui-input-inline">
    <input id="tel" type="text" name="text" required  lay-verify="required" disabled value="${tel}" placeholder="" autocomplete="off" class="layui-input">
  </div>
</div>
  <div class="layui-form-item">
    <label class="layui-form-label">面试官</label>
    <div class="layui-input-inline">
      <input id="text_appointment_contact1" type="text" name="text" required lay-verify="required"   value="${hr_name}" placeholder="" autocomplete="off" class="layui-input">
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">联系方式</label>
    <div class="layui-input-inline">
      <input id="hr_tel" type="text" name="text" required lay-verify="required"  value="${hr_tel}" placeholder="" autocomplete="off" class="layui-input">
    </div>
  </div>
   <div class="layui-form-item">
    <label class="layui-form-label">面试地址</label>
    <div class="layui-input-inline">
       <select id="text_appointment_address1" name="text" >
       <option selected value="${hr_place}">${hr_place}</option>
        ${place_opts}
        </select>
    </div>
  </div>
 <div class="layui-form-item">
    <label class="layui-form-label">温馨提示</label>
    <div class="layui-input-inline">
      <input id="text_appointment_attention1" type="text" name="text" required lay-verify="required" placeholder="" autocomplete="off" class="layui-input">
    </div>
  </div>
<div class="layui-form-item">
    <label class="layui-form-label">面试日期</label>
    <div  class="layui-input-inline">
      <input  autocomplete="off" type="text" class="layui-input" id="time">
  </div>
  </div>
  
  
  <div class="layui-form-item">
<div style="width: 420px;margin-left: 5px" class="layui-input-inline">
  
     <button week="${nweekDay1}" style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek2">本周一</button>
    <button week="${nweekDay2}" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek2">本周二</button>
    <button week="${nweekDay3}" style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek2">本周三</button>
    <button week="${nweekDay4}" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek2">本周四</button>   
    <button week="${nweekDay5}" style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek2">本周五</button>
  <br/>
   <button week="${weekDay1}" style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek2">下周一</button>
    <button week="${weekDay2}" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek2">下周二</button>
    <button week="${weekDay3}" style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek2">下周三</button>
    <button week="${weekDay4}" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek2">下周四</button>   
    <button week="${weekDay5}" style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs setweek2">下周五</button>
   
  </div>
  </div>

  <div class="layui-form-item">
    <label class="layui-form-label">面试时间</label>
    <div class="layui-input-inline">
      <input autocomplete="off" type="text" class="layui-input test-item1" id="time1">
  </div>
   <div class="layui-form-item">
<div style="width: 420px;margin-left: 5px" class="layui-input-inline">
  
   <button style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs settime2">9:00</button>
    <button type="button" class="layui-btn layui-btn-primary layui-btn-xs settime2">10:00</button>
       <button style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs settime2">13:00</button>
    <button type="button" class="layui-btn layui-btn-primary layui-btn-xs settime2">14:00</button>   
    <button style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs settime2">15:00</button>
    <br/>
       <button style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs settime2">9:30</button>
    <button type="button" class="layui-btn layui-btn-primary layui-btn-xs settime2">10:30</button>
       <button style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs settime2">13:30</button>
    <button type="button" class="layui-btn layui-btn-primary layui-btn-xs settime2">14:30</button>   
    <button style="text-align: center" type="button" class="layui-btn layui-btn-primary layui-btn-xs settime2">15:30</button>
    <br/>
  </div>
  </div>

  <div class="layui-form-item">
    <label class="layui-form-label">短信内容</label>
    <div  class="layui-input-inline">
    <textarea class="form-control" style="height:200px;overflow:auto"  id="text_mianshiinfo_duanxin" placeholder="短信内容" class="layui-textarea"></textarea>
  </div>
  </div>

  <br/>
  <div style="margin-top: 10px" class="layui-form-item">
    <label class="layui-form-label"></label>
    <div class="layui-input-inline">
        <button style="text-align: center" id="commitMsg" type="button" >立即提交</button>
        <button style="text-align: center" id="fasongMianshiDuanxin" type="button" >发送短信</button>
        <button style="text-align: center" id="fuzhiMianshiDuanxin" type="button" >复制短信</button>
  </div>

  <script>
  /*
  layui.use('form', function(){
    var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功

    form.on('select(brickType)', function(){   
        var addr = $(this).val()
        console.log('addr',addr)
        var addrTelMap = JSON.parse(localStorage.getItem("addrTelMap"))
        
        $('#text_appointment_contact1').val(addrTelMap[addr][0]);
        $('#hr_tel').val(addrTelMap[addr][1]);
        changeMianshiDuanxin();
    });
    
    form.on('select', function(data){
        console.log('addr')
        console.log(data.elem); //得到select原始DOM对象
        console.log(data.value); //得到被选中的值
        console.log(data.othis); //得到美化后的DOM对象
      }); 
    form.render(); //更新全部
    form.render('select'); //刷新select选择框渲染
    
});
*/
/*
$("#text_appointment_address1").change(function(){
    var addr = $(this).val()
    console.log('addr',addr)
    var addrTelMap = JSON.parse(localStorage.getItem("addrTelMap"))
    
    $('#text_appointment_contact1').val(addrTelMap[addr][0]);
    $('#hr_tel').val(addrTelMap[addr][1]);
    changeMianshiDuanxin();
   
})

function show_sub() {
    var addr = $(this).val()
    console.log('addr',addr)
    var addrTelMap = JSON.parse(localStorage.getItem("addrTelMap"))
    
    $('#text_appointment_contact1').val(addrTelMap[addr][0]);
    $('#hr_tel').val(addrTelMap[addr][1]);
    changeMianshiDuanxin();
    }
*/
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
                alert("Something error happend\\n");
            }
        }
    }
    xhr.send(JSON.stringify(data));
}
function changeMianshiDuanxin() {
    //加载默认信息
  //  var resume_info = JSON.parse(localStorage.getItem('box_resume_info'));
  //  var project_info = JSON.parse(localStorage.getItem('project_info'));
    var project_info = JSON.parse(localStorage.getItem('project_info'));
    
    var mianshiShijian = $('#time').val()+ '  ' +  $('#time1').val() ;
    /*
  var text_mianshiinfo_duanxin = project_info.mianshimuban.replace(/<[^>]+>/g,"");//去掉所有的html标记;
  text_mianshiinfo_duanxin=text_mianshiinfo_duanxin.replace(/\s+/g, "");
  text_mianshiinfo_duanxin=text_mianshiinfo_duanxin.replace(/\ +/g, "");
  text_mianshiinfo_duanxin=text_mianshiinfo_duanxin.replace(/[ ]/g, "");
  //text_mianshiinfo_duanxin=text_mianshiinfo_duanxin.replace(\r\n, "");
  text_mianshiinfo_duanxin=text_mianshiinfo_duanxin.trim();
  */
   var text_mianshiinfo_duanxin = project_info.mianshimuban;
   var name = localStorage.getItem('reusme_info_username');
   text_mianshiinfo_duanxin =text_mianshiinfo_duanxin.replace('【姓名】', name);
   text_mianshiinfo_duanxin =text_mianshiinfo_duanxin.replace('【岗位】', project_info.name);
   text_mianshiinfo_duanxin =text_mianshiinfo_duanxin.replace('【面试时间】', mianshiShijian);
   text_mianshiinfo_duanxin =text_mianshiinfo_duanxin.replace('【面试地点】', document.getElementById("text_appointment_address1").value);
   text_mianshiinfo_duanxin =text_mianshiinfo_duanxin.replace('【联系人】', document.getElementById("text_appointment_contact1").value);
   text_mianshiinfo_duanxin =text_mianshiinfo_duanxin.replace('【联系方式】', document.getElementById("hr_tel").value);
  // $('#text_mianshiinfo_duanxin').innerHTML = text_mianshiinfo_duanxin;
   $('#text_mianshiinfo_duanxin').val(text_mianshiinfo_duanxin);
  // $('#text_mianshiinfo_duanxin').html(text_mianshiinfo_duanxin);
}

function submitInterviewById2(interviewId, url, status_value, sub_status) {
    //项目Id
    // post_selected_value = projectId = $('#resumeInfo').attr('projectId')
    console.log('submitInterviewById,post_select_value:',post_selected_value)
    // var interview_id = $('#resumeInfo').attr('interviewId')
    var data = {
        "is_active": true,
        "status": status_value,
        "post": post_selected_value,
        "result": "Pending",
        "sub_status": sub_status,
    };
    
    //请求之前保证面试时间， 日期不能为空
    var time = $('#time').val()
    var time1 = $('#time1').val()
    
    if(time==''){
        layer.msg('面试日期不能为空')
        return false
    }
    if(time1==''){
        layer.msg('面试时间不能为空')
        return false
    }
    
    var formatTime = time + ' ' + time1
    
    
        var project_info = JSON.parse(localStorage.getItem('project_info'));

    
    //联系人
    var contact = $('#text_appointment_contact1').val()
    var address = $('#text_appointment_address1').val()
    //岗位名
    var postname = project_info.name
    //温馨提示
    var attention = $('#text_appointment_attention1').val()

    
    
    var data1 = {
      "interview": interviewId,
      "result_type": 3,
      "date": formatTime,//helper_get_textbox_text("text_appointment_date"),
      "contact": contact,//helper_get_textbox_text("text_appointment_contact"),
      "address": address,//helper_get_textbox_text("text_appointment_address"),
      "postname":postname, //helper_get_textbox_text("text_appointment_postname"),
      "certification": "",//helper_get_textbox_text("text_appointment_certification"),
      "attention": attention,//helper_get_textbox_text("text_appointment_attention"),
      "first_impression": "",//helper_get_textbox_text("text_appointment_first_impression"),
      "notes": "",//helper_get_textbox_text("text_appointment_notes"),
    };
    
    xhr_common_send("POST","/interviews/api/appointment_sub/", data1);

    setTimeout(function() {
          xhr_common_send("PATCH", url + interviewId + '/', data);
    },300)
    

    // xhr_common_send("PATCH", url + interviewId + '/', data);

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

var dightCnt = 0;

$(document).on('click', '#commitMsg', function () {
    
    //简单处理弹出两次弹出两次的情况
    if (dightCnt > 0) {
        return false;
    }
    dightCnt++;
    

    
    var status = 3;
    //TODO 取值加发短信 还没提供短信接口
    
    
    var _this_interview_value = localStorage.getItem('_this_interview_value');
    
    submitInterviewById2(localStorage.getItem("_this_interview_value"), "/api/interviews/", status, '面试');

});

$(document).on('click', '#fasongMianshiDuanxin', function () {  
   // var resume_info = JSON.parse(localStorage.getItem('box_resume_info'));
    var phone_number = localStorage.getItem('reusme_info_phone_number');
    console.log('phone_number' , phone_number)
    if (!phone_number || phone_number.length != 11 || typeof phone_number === 'undefined') {
        layer.msg('手机号格式错误,拨号失败');
        return false
    }
    
    var tel_name = localStorage.getItem('cache_username');
    var tel_password = localStorage.getItem('cache_password');
    console.log(tel_name);
    console.log(tel_password);
    var pn = localStorage.getItem('reusme_info_phone_number') ;
    var dx = document.getElementById("text_mianshiinfo_duanxin").value;


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
              console.log('发送短信中');
              send({"messageType": "phoneSendSms", "data": {"phone": pn,"text":dx,"smsid":"xxxxxsssszzzzrrrr"}})
              layer.msg('发送成功')
              break;
            case "phoneInfo":
                if(!tiped){
                                  layer.msg('发送成功');
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
        
       
});

$(document).on('click', '#fuzhiMianshiDuanxin', function () {  
    changeMianshiDuanxin();
    var Url2=document.getElementById("text_mianshiinfo_duanxin");
    Url2.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
   // alert("已复制好，可贴粘。");
   // layer.msg('已复制好，可贴粘。');
   // prompt("已复制好，可贴粘。");
 });


$(document).on('click', '.setweek2', function () {
     console.log($(this).attr('week'));
    $('#time').val($(this).attr('week'));    
    changeMianshiDuanxin();
});
$(document).on('click', '.settime2', function () {
     console.log($(this).html());
    $('#time1').val($(this).html());    
    changeMianshiDuanxin();
});

$(document).ready(function(){
   $("#text_appointment_address1").change(function(){
       var addr = $(this).val()
       console.log('addr',addr)
       var addrTelMap = JSON.parse(localStorage.getItem("addrTelMap"))
       
       $('#text_appointment_contact1').val(addrTelMap[addr][0]);
       $('#hr_tel').val(addrTelMap[addr][1]);
       changeMianshiDuanxin();
      
   })
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

},
});

}


$(document).on('click', '.stage_two_fail', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    resume_id = this.dataset.resume_id;
    //show_stop_modal(interview_selected_value, resume_id)
    show_callCandidate_modal(post_selected_value, resume_id);
});

function stage_three_miss() {
    resume_id = localStorage.getItem("resume_id")
    // var post_selected_value = localStorage.getItem("test_box_useprojectid");
    //interview_selected_value = localStorage.getItem("interview_selected_value")
    interview_selected_value = Number(this.id);
    show_callCandidate_modal(post_selected_value, resume_id);
}

$(document).on('click', '.stage_three_miss', function () {
    interview_selected_value = Number(this.id);
    resume_id = this.dataset.resume_id;
    resume_selected_value = Number(this.dataset.resume_id)
    show_callCandidate_modal(post_selected_value, resume_id);
});


function stage_three_pass() {
    resume_id = localStorage.getItem("resume_id")
    // var post_selected_value = localStorage.getItem("test_box_useprojectid");
   // interview_selected_value = localStorage.getItem("interview_selected_value")
    interview_selected_value = Number(this.id);

    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        document.getElementById("text_interview_resumeinfo_username").value = response.username;
        document.getElementById("text_interview_resumeinfo_phone_number").value = response.phone_number;
    })
    $('#interviewResultModal').modal('toggle')
}


$(document).on('click', '.stage_three_pass', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    resume_id = this.dataset.resume_id;

    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        document.getElementById("text_interview_resumeinfo_username").value = response.username;
        document.getElementById("text_interview_resumeinfo_phone_number").value = response.phone_number;
    })
    $('#interviewResultModal').modal('toggle')
});

$(document).on('click', '.stage_three_not_pass', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    resume_id = this.dataset.resume_id;

    // xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function(response) {
    //     document.getElementById("text_interview_resumeinfo_username").value = response.username;
    //     document.getElementById("text_interview_resumeinfo_phone_number").value = response.phone_number;
    // })
    $('#interviewFailResultModal').modal('toggle')
});

$(document).on('click', '.stage_three_fail', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = this.dataset.resume_id
    resume_id = this.dataset.resume_id;
    //show_stop_modal(interview_selected_value, resume_id)
    show_callCandidate_modal(post_selected_value, resume_id);
});


function stage_four_update() {
    resume_id = localStorage.getItem("resume_id")
    // var post_selected_value = localStorage.getItem("test_box_useprojectid");
    //interview_selected_value = localStorage.getItem("interview_selected_value")
    interview_selected_value = Number(this.id);

    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        document.getElementById("text_update_offer_resumeinfo_username").value = response.username;
        document.getElementById("text_update_offer_resumeinfo_phone_number").value = response.phone_number;
    })
    //$('#offerUpdateModal').modal('toggle')
    $('#offerUpdateModal').modal('show')
    
}


$(document).on('click', '.stage_four_update', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    resume_id = this.dataset.resume_id;

    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        document.getElementById("text_update_offer_resumeinfo_username").value = response.username;
        document.getElementById("text_update_offer_resumeinfo_phone_number").value = response.phone_number;
    })
    $('#offerUpdateModal').modal('toggle')
});

$(document).on('click', '#fuzhiOfferDuanxin', function () { 
    //console.log('已复制好，可贴粘。'); 
    //changeOfferDuanxin();
    var Url3=document.getElementById("text_offerinfo_duanxin");
    Url3.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
  //  alert("已复制好，可贴粘。");
    layer.msg('已复制好，可贴粘。');

     });

     

$(document).on('click', '.sendMessageEntry', function () {

    var phone_number = document.getElementById("text_offerinfo_contact_phone").value ;
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
        <button style="text-align: center" id="commitMsg" type="button" class="layui-btn layui-btn-normal">发送短信</button>
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

    var pn = document.getElementById("text_offer_resumeinfo_phone_number").value;
    var dx = document.getElementById("text_offerinfo_duanxin").value;

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
/*
{
    "messageType":"phoneSendSms",
    "data":{"smsid":"xxxxxsssszzzzrrrr","phone":"13800001111","text":"发送的短信"}pn
    }
*/
              //直接拨号
              console.log('拨号中');
              send({"messageType": "phoneSendSms", "data": {"phone": pn,"text":dx,"smsid":"xxxxxsssszzzzrrrr"}})
              layer.msg('发送成功')
              break;
            case "phoneInfo":
                if(!tiped){
                                  layer.msg('发送成功');
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

   // layer.msg('发送成功');
    $('#offerModal').modal('hide')
});


$(document).on('click', '.sendYaoyueMessageEntry', function () {

    var phone_number = document.getElementById("text_yaoyueinfo_contact_phone").value ;
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
        <button style="text-align: center" id="commitMsg" type="button" class="layui-btn layui-btn-normal">发送短信</button>
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

    var pn = document.getElementById("text_yaoyue_resumeinfo_phone_number").value;
    var dx = document.getElementById("text_yaoyueinfo_duanxin").value;

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
/*
{
    "messageType":"phoneSendSms",
    "data":{"smsid":"xxxxxsssszzzzrrrr","phone":"13800001111","text":"发送的短信"}pn
    }
*/
              //直接拨号
              console.log('拨号中');
              send({"messageType": "phoneSendSms", "data": {"phone": pn,"text":dx,"smsid":"xxxxxsssszzzzrrrr"}})
              layer.msg('发送成功')
              break;
            case "phoneInfo":
                if(!tiped){
                                  layer.msg('发送成功');
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

   layer.msg('发送成功');
   // $('#offerModal').modal('hide')
});


function stage_four_pass() {
    resume_id = localStorage.getItem("resume_id")
    // var post_selected_value = localStorage.getItem("test_box_useprojectid");
    //interview_selected_value = localStorage.getItem("interview_selected_value")
    interview_selected_value = Number(this.id);

    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        document.getElementById("text_offer_resumeinfo_username").value = response.username;
        document.getElementById("text_offer_resumeinfo_phone_number").value = response.phone_number;
    })

    $('#offerModal').modal('toggle')

    //加载默认信息
    var resume_info = JSON.parse(localStorage.getItem('resume_info'));
    var project_info = JSON.parse(localStorage.getItem('project_info'));


    var name = resume_info.username;
    var hr_name = project_info.link.substring(0, project_info.link.indexOf('('));
    var hr_tel = project_info.link.substring(project_info.link.indexOf('(') + 1, project_info.link.indexOf(')'));
    var hr_place = project_info.place;

   // var text_offerinfo_duanxin = '姓名:' + name + '公司:' + '岗位:' +'入职时间:' + '入职地点' +hr_place+'联系人'+ '携带资料' +'薪资待遇' + '其他事项';
   var text_offerinfo_duanxin = project_info.offermuban;

    $('#text_offerinfo_contact').val(hr_name)
    $('#text_offerinfo_contact_phone').val(hr_tel)
    $('#text_offerinfo_address').val(hr_place)
    $('#text_offerinfo_contact').val(hr_name)

    $('#text_offerinfo_postname').val(project_info.name)

    $('#text_offerinfo_duanxin').val(text_offerinfo_duanxin)


}

$("#text_offerinfo_address").change(function(){
    var addr = $(this).val()
    console.log('addr',addr)
    var addrTelMap = JSON.parse(localStorage.getItem("addrTelMap"))
    var project_info = JSON.parse(localStorage.getItem('project_info'));
    
    $('#text_offerinfo_contact').val(addrTelMap[addr][0]);
    $('#text_offerinfo_contact_phone').val(addrTelMap[addr][1]);

    //var text_offerinfo_duanxin = project_info.offermuban.replace(/<[^>]+>/g,"");//去掉所有的html标记;
    var text_offerinfo_duanxin = project_info.offermuban;
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【姓名】', document.getElementById("text_offer_resumeinfo_username").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【岗位】', document.getElementById("text_offerinfo_postname").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【入职时间】', document.getElementById("text_offerinfo_date").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【入职地点】', document.getElementById("text_offerinfo_address").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【联系人】', document.getElementById("text_offerinfo_contact").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【联系方式】', document.getElementById("text_offerinfo_contact_phone").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【薪资待遇】', document.getElementById("text_offerinfo_salary").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【携带资料】', document.getElementById("text_offerinfo_certification").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【备注】', document.getElementById("text_offerinfo_notes").value);

    $('#text_offerinfo_duanxin').val(text_offerinfo_duanxin)   
   
});

$(document).on('click', '.stage_four_pass', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    resume_id = this.dataset.resume_id;

    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        document.getElementById("text_offer_resumeinfo_username").value = response.username;
        document.getElementById("text_offer_resumeinfo_phone_number").value = response.phone_number;
    })

    $('#offerModal').modal('toggle')

    //加载默认信息
    var resume_info = JSON.parse(localStorage.getItem('resume_info'));
    var project_info = JSON.parse(localStorage.getItem('project_info'));
  //包装选择地址时的变更联系人和电话
  var hr_place,hr_name,hr_tel;
  var addrTelMap = {
    [hr_place]: [hr_name, hr_tel]
  }
    var place_opts = `<option selected value="${hr_place}">${hr_place}</option>`
    if (project_info.extra_address && project_info.extra_address != '') {
        var address_province = project_info.address_province || ''
        var address_city = project_info.address_city || ''
        var base_addr = address_province + address_city
        var extra_address = JSON.parse(project_info.extra_address)
        for (var extra of extra_address) {
            place_opts += `<option value="${base_addr}${extra.district_id}${extra.street_id}${extra.address_suite}">${base_addr}${extra.district_id}${extra.street_id}${extra.address_suite}</option>`
            //添加街道 和 具体地址
            addrTelMap[base_addr + extra.district_id + extra.street_id + extra.address_suite] = [extra.linkman_name, extra.linkman_phone]
        }
    }
    localStorage.setItem("addrTelMap", JSON.stringify(addrTelMap))
    $('#text_offerinfo_address').html(place_opts)

    var name = resume_info.username;
   // var hr_name = project_info.link.substring(0, project_info.link.indexOf('('));
   // var hr_tel = project_info.link.substring(project_info.link.indexOf('(') + 1, project_info.link.indexOf(')'));
   // var hr_place = project_info.place;

     //console.log(project_info)
    $('#text_offerinfo_contact').val(hr_name)
    $('#text_offerinfo_contact_phone').val(hr_tel)
    $('#text_offerinfo_address').val(hr_place)
    $('#text_offerinfo_contact').val(hr_name)

    $('#text_offerinfo_postname').val(project_info.name)

   // var text_offerinfo_duanxin = project_info.offermuban.replace(/<[^>]+>/g,"");//去掉所有的html标记;
   var text_offerinfo_duanxin = project_info.offermuban;
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【姓名】', document.getElementById("text_offer_resumeinfo_username").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【岗位】', document.getElementById("text_offerinfo_postname").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【入职时间】', document.getElementById("text_offerinfo_date").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【入职地点】', document.getElementById("text_offerinfo_address").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【联系人】', document.getElementById("text_offerinfo_contact").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【联系方式】', document.getElementById("text_offerinfo_contact_phone").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【薪资待遇】', document.getElementById("text_offerinfo_salary").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【携带资料】', document.getElementById("text_offerinfo_certification").value);
    text_offerinfo_duanxin =text_offerinfo_duanxin.replace('【备注】', document.getElementById("text_offerinfo_notes").value);

    $('#text_offerinfo_duanxin').val(text_offerinfo_duanxin)


});


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


//监听INput,并且动态添加到select
$("input[name=reject_option]").each(function () {
    $(this).click(function () {
        var value = $("input[name=reject_option]:checked").val();
        // alert('选中val' + value);
        //op opt
        console.log(value)
        // $('#future_box').empty()
        $('#future_box').show();
        $('#future_box2').hide();
        $('#future_box3').hide();
        $('#future_box4').hide();

        //处理2个特殊

        if (value == 'expected_industry') {

            //hangye
            $('#future_box').hide();
            $('#future_box2').hide();
            $('#future_box3').show()
            $('#future_name').html('行业类别');
        } else if (value == 'expected_post') {
            $('#future_box').hide();
            $('#future_box2').hide();
            $('#future_box4').show()
            $('#future_name').html('岗位类别');

//gangwei
        } else if (value == 'not' || value == 'weilianxishang' || value == 'haomacuowu') {
            $('#future_box').hide();
            $('#future_name').html('');
        } else if (value == 'muqianjuzhudi') {
            box_resume_info(resume_selected_value)
            $('#future_name').html('目前居住地');
            $('#future_box').hide();
            $('#future_box2').show();
            // $('#future_box').html(`<input name="forward" id="forward" class="form-control"/>`)
        } else if (value == 'expected_salary') {
            $('#future_name').html('期望薪资');
            $('#future_box').html(`<input name="forward" id="forward" class="form-control"/>`)
        } else {
            // var opts = ``;
            console.log(colMap[value])
            $('#future_name').html(colMap[value].name)
            getColValMap(colMap[value].real)
            // for (var k in colMap[value].valMap) {
            //   if (k == '-1') continue;
            //   opts += `<option value="${k}">${colMap[value].valMap[k]}</option>`
            // }
            //
            //
            // var html =
            //     `
            //     <select id="forward" class="form-control" name="forward">
            //     ${opts}
            //     </select>
            //     `;
            //
            // $('#future_box').html(html)
        }


    });
});

//先均采用select
function getColValMap(kind) {
    $.ajax({
        type: "GET",
        url: '/api/labellibslist/?kind=' + kind,
        dataType: "json",
        success: function (data) {

            //两个逻辑特殊处理:
            if (kind == 'hangyeleibie' || kind == 'gangweileibie') {

                // //dom render
                // $('#future_box').html(
                //     `<input autocomplete="off" type="text" class="form-control ${kind}" name="forward"
                //                    placeholder=""
                //                    value=""/>`
                // )
                //
                // var process = {}
                // for (var da of data.results) {
                //   var prop = {
                //     colorName: da.name,
                //     colorNum: "",
                //     colorList: []
                //   }
                //   if (da.parent === 0) {
                //     process[da.id] = prop
                //   } else {
                //     if (process[da.parent]) {
                //       delete prop.colorList
                //       process[da.parent].colorList.push(prop)
                //     }
                //   }
                //
                // }
                // console.log(process)
                //
                // //复用实例
                // var obj = kind =='hangyeleibie'?SelectColor:SelectColor1
                // new obj({
                //   elem: "." + kind,
                //   range: "|",
                //   data: Object.values(process)
                // })
                // ;

            } else {
                console.log('getColValMap:', data)
                var opts = `<option value=""></option>`;
                var results =
                    kind == 'hangyeleibie' || kind == 'gangweileibie'
                        ? data.results.filter(r => r.parent !== 0)
                        : data.results.filter(r => r.parent === 0)
                for (var k of results) {
                    opts += `<option value="${k.id}">${k.name}</option>`
                }
                var html =
                    `
              <select id="forward" class="form-control" name="forward">
              ${opts}
              </select>
              `;

                $('#future_box').html(html)
            }
        }
    });
}

function initGangweiSel() {
    var ps = ['gangweileibie', 'hangyeleibie', 'gangweitezheng']
    for (var p of ps) {
        (function (kind) {
            $.ajax({
                type: "GET",
                url: '/api/labellibslist/?kind=' + kind,
                dataType: "json",
                success: function (data) {
                    var opts = `<option value=""></option>`;
                    var results =
                        kind == 'hangyeleibie' || kind == 'gangweileibie'
                            ? data.results.filter(r => r.parent !== 0)
                            : data.results.filter(r => r.parent === 0)
                    for (var k of results) {
                        opts += `<option value="${k.id}">${k.name}</option>`
                    }
                    var html =
                        `
              ${opts}
              `;

                    $('#' + kind).html(html)
                }
            });
        })(p)
    }
}

initGangweiSel()


function getStreets(id, keyword, fn) {

    console.log('req..')
    $.ajax({
        type: "GET",
        url: 'http://district.market.alicloudapi.com/v3/config/district',
        // dataType: "jsonp",
        // jsonp: "callback",
        headers: {'Authorization': "APPCODE " + 'ba0b5b1ecfd24a6eaa8c1234de7978b3'},
        data: {
            // "callback": "callback",
            "extensions": "base",
            "filter": keyword == '宝山区' ? "310113" : "",
            "offset": "20",
            "output": "JSON",
            "page": "1",
            "showbiz": "true",
            "subdistrict": "3",
            "keywords": keyword
        },
        success: function (data) {
            var strs = [];
            if (data.status != "1") {
                alert('高德地图请求失败,请检查网络');
                return false;
            }
            if (data.districts.length == 0) return strs;
            var strs = [];
            for (var s in data.districts[0].districts) {
                strs.push(data.districts[0].districts[s].name);
            }
            console.log(strs);
            $('#' + id).empty();
            for (var str of strs) {
                var h = `<option value="${str}">${str}</option>`;
                $('#' + id).append(h);
            }
            if (fn)
                fn()
        }
        ,
        error: function (err) {
            console.log('err', err)
        }
    })
}


function box_resume_info(rid) {
    console.log('开始赋值放弃面试框的地址选项')
    xhr_common_send('GET', '/api/resumes/' + rid + '/', null, function (response) {
        console.log('需要赋值的简历:', response)
        $('#distpicker').distpicker("destroy")
        $('#distpicker').distpicker({
            province: response.current_settle_province || '',
            city: response.current_settle_city || '',
            district: response.current_settle_district || ''
        });
        // $('#province_id').val(response.current_settle_province || '')
        console.log('省市区赋值完成')

        if (response.current_settle_district) {
            getStreets('street_id', response.current_settle_district, function () {
                // $('#street_id').val(res.address_street)
                $('#street_id').val(response.current_settle_street)
                console.log('街道赋值完成')
            })
        }
        localStorage.setItem("box_reusme_info", JSON.stringify(response))
    });
}


function stage_four_fail(interviewId) {
    resume_id = localStorage.getItem("resume_id")
    // var post_selected_value = localStorage.getItem("test_box_useprojectid");
    interview_selected_value = interviewId;//localStorage.getItem("iframe_interviewId")
    console.log('cacheed interviewid = ', interview_selected_value);

    box_resume_info(resume_id)
    $('#reject_form')[0].reset()
    $('#future_box').hide();
    $('#future_box2').hide();

    $('#reject_div').modal('toggle');
}

//2020年03月27日20:25:54 改为新的拒绝弹窗
$(document).on('click', '.stage_four_fail', function () {

    console.log('this.id , ', this.id)

    //如果没有创建interview 先创建
    if (this.id && !isNaN(this.id) && this.id != 'null') {
        console.log('process1')
        interview_selected_value = Number(this.id);
        resume_id = this.dataset.resume_id;
        resume_selected_value = this.dataset.resume_id;
        console.log(resume_id, resume_selected_value);
        $('#reject_form')[0].reset()
        $('#future_box').hide();
        $('#future_box2').hide();
        box_resume_info(resume_id)
        $('#reject_div').modal('toggle');
    } else {
        console.log('process2')

        resume_id = this.dataset.resume_id;
        resume_selected_value = this.dataset.resume_id;
        console.log(resume_id, resume_selected_value);

        var fstatus = 2;
        var ftxt = '邀约'
        if (filter_status_value == 1) {
            fstatus = filter_status_value
            ftxt = '筛选'
        }

        create_interview(resume_id, post_selected_value, "/api/interviews/", fstatus, ftxt, true, function (res) {
            interview_selected_value = res.id
            $('#reject_form')[0].reset()
            $('#future_box').hide();
            $('#future_box2').hide();
            box_resume_info(resume_id)
            $('#reject_div').modal('toggle');
        })


    }


});


function stage_five_update() {
    resume_id = localStorage.getItem("resume_id")
    // var post_selected_value = localStorage.getItem("test_box_useprojectid");
    interview_selected_value = localStorage.getItem("interview_selected_value")

    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        document.getElementById("text_entry_update_resumeinfo_username").value = response.username;
        document.getElementById("text_entry_update_resumeinfo_phone_number").value = response.phone_number;
    })
    // This is a popup
    show_entry_update_modal(interview_selected_value);
}


$(document).on('click', '.stage_five_update', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    resume_id = this.dataset.resume_id;
    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        document.getElementById("text_entry_update_resumeinfo_username").value = response.username;
        document.getElementById("text_entry_update_resumeinfo_phone_number").value = response.phone_number;
    })
    // This is a popup
    show_entry_update_modal(interview_selected_value);
});


function stage_five_pass() {
    resume_id = localStorage.getItem("resume_id")
    // var post_selected_value = localStorage.getItem("test_box_useprojectid");
    interview_selected_value = localStorage.getItem("interview_selected_value")
    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        document.getElementById("text_entry_resumeinfo_username").value = response.username;
        document.getElementById("text_entry_resumeinfo_phone_number").value = response.phone_number;
    })

    $('#entryedModal').modal('toggle')
}

$(document).on('click', '.stage_five_pass', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    resume_id = this.dataset.resume_id;

    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        document.getElementById("text_entry_resumeinfo_username").value = response.username;
        document.getElementById("text_entry_resumeinfo_phone_number").value = response.phone_number;
    })

    $('#entryedModal').modal('toggle')
});

$(document).on('click', '.stage_five_fail', function () {
    interview_selected_value = Number(this.id);
    resume_id = this.dataset.resume_id;
    resume_selected_value = this.dataset.resume_id;
    //show_stop_modal(interview_selected_value, resume_id)
    // show_callCandidate_modal(post_selected_value, resume_id);

    $('#reject_form')[0].reset()
    $('#future_box').hide();
    $('#future_box2').hide();

    box_resume_info(resume_id)

    $('#reject_div').modal('toggle');

});

$(document).on('click', '.stage_six_giveup', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    resume_id = this.dataset.resume_id;
    //show_stop_modal(interview_selected_value, resume_id)
    show_callCandidate_modal(post_selected_value, resume_id);
});


function stage_six_pass() {
    resume_id = localStorage.getItem("resume_id")
    // var post_selected_value = localStorage.getItem("test_box_useprojectid");
    interview_selected_value = localStorage.getItem("interview_selected_value")

    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        document.getElementById("text_probation_resumeinfo_username").value = response.username;
        document.getElementById("text_probation_resumeinfo_phone_number").value = response.phone_number;
    })

    $('#probationSuccModal').modal('toggle')
}

$(document).on('click', '.stage_six_pass', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    resume_id = this.dataset.resume_id;

    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function (response) {
        document.getElementById("text_probation_resumeinfo_username").value = response.username;
        document.getElementById("text_probation_resumeinfo_phone_number").value = response.phone_number;
    })

    $('#probationSuccModal').modal('toggle')
});

$(document).on('click', '.stage_six_no_pass', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    resume_id = this.dataset.resume_id;

    // xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function(response){
    //  document.getElementById("text_probation_resumeinfo_username").value = response.username;
    //  document.getElementById("text_probation_resumeinfo_phone_number").value = response.phone_number;
    // })

    $('#probationSuccModal').modal('toggle')
});


function stage_six_fail() {
    resume_id = localStorage.getItem("resume_id")
    // var post_selected_value = localStorage.getItem("test_box_useprojectid");
    interview_selected_value = localStorage.getItem("interview_selected_value")

    $('#probationFailModal').modal('toggle')

}


$(document).on('click', '.stage_six_fail', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    $('#probationFailModal').modal('toggle')
});

$(document).on('click', '.stage_seven_register', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    $('#pbRegisterModal').modal('toggle')
});

$(document).on('click', '.stage_seven_bill', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    $('#pbInvoiceModal').modal('toggle')
});

$(document).on('click', '.stage_seven_pass', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    $('#pbFinishModal').modal('toggle')
});

$(document).on('click', '.stage_seven_fail', function () {
    interview_selected_value = Number(this.id);
    resume_selected_value = Number(this.dataset.resume_id)
    $('#pbBaddebtModal').modal('toggle');
});

// post table

$('#dataTable_post tbody').on('click', 'tr', function () {
    var id = this.id;

    console.log('id:', id);
    localStorage.setItem("test_box_useprojectid", id);
    // console.log('post_selected_value:', post_selected_value)


    //重置上方的 status
    // filter_status_value = 0

    console.log('当前选择的post_selected：', post_selected_value)
    console.log('当前选择的filter_status_value：', filter_status_value)
  
    //reset form 不重置会把上个项目的条件放到当前项目中
    $('#queryform')[0].reset();

    if (id === post_selected_value && post_selected === true) {
        console.log('logic1');
        $(this).toggleClass('selected');
        post_selected = false;

        document.getElementById("text_company_name").innerHTML = "选择项目";
    } else {
        console.log('logic2');
        $(this).toggleClass('selected');

        if (post_selected === true) {
            $('tr#' + post_selected_value).toggleClass('selected');
        }
        post_selected = true;
        post_selected_value = id;
        getCurPermSync(id);

        var tr = document.getElementById(id);

        console.log('post_selected_value', post_selected_value);

        $.ajax({
            url: '/api/posts/' + post_selected_value + '/',
            type: 'GET',
            data: null,
            success: function (response) {
                // update filter also, so the filter strategy is changed that:
                // the widget will display the post's address value, then the actual filter will only refer to the widget value but not the post value
                localStorage.setItem("project_info", JSON.stringify(response))
                document.getElementById("working_place_province").value = response.address_province;
                document.getElementById("working_place_city").value = response.address_city;
                document.getElementById("working_place_district").value = response.address_district;
                document.getElementById("working_place_street").value = response.address_street;
                document.getElementById("working_place_suite").value = response.address_suite;
            },
            error: function () {
                console.log("get resume info failed");
            },
        });

        page_refresh(table, true);

        document.getElementById("text_company_name").innerHTML = tr.innerText;
        document.getElementById("projectName").innerHTML = tr.innerText;
    }
});

function do_dial_submit(resume_id) {
    var post_id = post_selected_value;
    var status = 0;

    $.ajax({
        type: "POST",
        url: '/interview/ai/task/',
        data: $('#ai_config_form').serialize(),

    });

    $('#dialModal').modal('hide');

    //
    $.ajax({
        type: "POST",
        url: '/api/call_flag',
        data: {
            id: resume_id,
            post_id, post_selected_value
        }, success: function (res) {
            // page_refresh(table, false)
        }

    });
    //remove class
    var ele = 'btn_' + resume_id
    $('.'  + ele).removeClass('stage_zero_ai')
    $('.' + ele).css("color","rgb(255,240,245)")//"#00000030")


    // create_interview(resume_id, post_id, "/api/interviews/", status, 'AI面试');
}

$(function () {
    $('#dialFormSubmit').click(function (e) {
        e.preventDefault();
        multisel_submit_wrapper_resumeid(do_dial_submit);
    });
});

$(function () {
    $('#projSelectorBtn').click(function (e) {
        e.preventDefault();
        $('#projSelector').modal('show')
    });
});

function getCurPermSync(post_id) {
    $('#projPermInfo').empty()
    //$('#projPermInfo').append("<span>"+"当前的权限分配信息如下:"+"</span>")
    console.log("Enter getCurPermSync---->", post_id)

    xhr_common_send('GET', '/api/permissions/?post_id=' + post_id, null, function (response) {
        //console.log("response ", response)
        result = ""
        $.each(response.results, function (index, ele) {
            result += ele.stage_name + ":" + ele.user_name + "\n";
        });
        console.log(result)
        //$('#projPermInfo').append('<span style="display:inline">'+ele.stage_name + ':' + ele.user_name + '</span>')
        $('#projPermInfo').val(result)
    })
}

getRecruiterSync()
/*
  $('#cRecruiter').click(function(e) {
    console.log("click the cRecruiter selector")
  });
  */

$('#permOp').change(function (e) {
    var stage = $('#interview_stage_id').val()
    var who = $('#cRecruiter').val()
    var op = $('#permOp').val()
    var fields = 'post=' + post_selected_value + '&user=' + who + '&stage=' + stage
    $('#permOp').val("")
    $('#interview_stage_id').val("")
    $('#cRecruiter').val("")
    data = {
        "post": post_selected_value,
        "user": who,
        "stage": stage,
    }
    console.log("Permission Info: ", data)
    if (op == "增加") {
        xhr_common_send('POST', '/api/permissions/', data)
        setTimeout(getCurPermSync, 1000, post_selected_value)
        setTimeout(getCurPermSync, 2000, post_selected_value)
        //setTimeout("getCurPermSync(post_selected_value)", 1000)
    } else if (op == "删除") {
        // step1: get the item
        if ((post_selected_value <= 0) || who <= 0 || stage.length <= 0) {
            alert("请确保职位等信息")
            console.log("Fail", post_selected_value, who, stage)
            return
        }

        xhr_common_send('GET', '/api/permissions/?post=' + post_selected_value + '&user=' + who + '&stage=' + stage, null, function (response) {
            console.log('/api/permissions/?post_id=' + post_selected_value + '&user=' + who + '&stage=' + stage)
            $.each(response.results, function (index, ele) {
                console.log(ele)
                console.log(stage.includes(ele.stage_id))
                if (stage.includes(ele.stage_id.toString(10)) &&
                    (post_selected_value == ele.post_id) &&
                    (who == ele.user_id)) {
                    console.log("to delete index: ", index, " ", ele.id)
                    xhr_common_send('DELETE', '/api/permissions/' + ele.id + '/', null)
                } else {
                    console.log("No need to delete", ele.user_name)
                }
                setTimeout(getCurPermSync, 1000, post_selected_value)
                setTimeout(getCurPermSync, 2000, post_selected_value)
            });
        })

    }
    getCurPermSync(post_selected_value)
    /*
  $.ajax({
    url:'/api/permissions/' ,
    type: 'POST',
    data: fields,
    success: function(response) {
        getCurPermSync(post_selected_value)
    },
    error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            console.log(jqXHR.status);
            console.log(jqXHR.readyState);
            console.log(jqXHR.statusText);
            console.log(textStatus);
            console.log(errorThrown);

        alert('Sth Wrong')
    },
  });
    */
});

function getRecruiterSync() {
    $('#cRecruiter').html("")
    $('#cRecruiter').prepend('<option value=""></option>')
    console.log("Enter getRecruiterSync ---->")
    xhr_common_send('GET', '/api/accounts/?user_type=Recruiter', null, function (response) {
        $.each(response.results, function (index, ele) {
            $('#cRecruiter').append('<option value=' + ele.id + '>' + ele.username + '</option>')
        })
    })
}

$(function () {
    $('#projPermissionBtn').click(function (e) {
        if (toCollapsed) {
            toCollapsed = false;
            $(".sidebar2.right").trigger("sidebar:open");
        } else {
            toCollapsed = true;
            $(".sidebar2.right").trigger("sidebar:close");
        }

        return
        e.preventDefault();
        // step0: Get the all recruiter
        // step1: First should update the header
        console.log("post_seelcted_value", post_selected_value)

        xhr_common_send('GET', '/api/posts/' + post_selected_value + '/', null, function (response) {
            $('#projPermName').text(response.name)
            $('#permOp').val("")
            $('#interview_stage_id').val("")
            console.log("pre getRecruiterSync")
            getRecruiterSync()
            console.log("post getRecruiterSync")
            console.log("pre getCurPermSync")
            getCurPermSync(post_selected_value)
            console.log("~~~~~~");
            $('#projPermission').modal('show')
            console.log("show le ne");
        })

        // step2: Then the all recruiter

    });
});

function do_next_submit(interview_id) {
    var status = 2;
    $('#nextModal').modal('hide');
    submit_interview_by_id(interview_id, "/api/interviews/", status, '邀约');
}

$('#nextSubmit').click(function (e) {
    e.preventDefault();
    multisel_submit_wrapper(do_next_submit);
});

function do_stop_submit(interview_id) {
    $('#stopModal').modal('hide');

    data = {
        "interview": interview_id,
        "expected_industry": helper_get_selectbox_text("text_terminate_expected_industry"),
        "expected_post": helper_get_selectbox_text("text_terminate_expected_post"),
        "expected_shift": helper_get_selectbox_text("text_terminate_expected_shift"),

        "expected_salary": helper_get_textbox_text("text_terminate_expected_salary"),
        "expected_notes": helper_get_textbox_text("text_terminate_expected_notes"),
        "expected_province": helper_get_textbox_text("text_terminate_expected_province"),
        "expected_city": helper_get_textbox_text("text_terminate_expected_city"),
        "expected_district": helper_get_textbox_text("text_terminate_expected_district"),

        "expected_insurance": helper_get_selectbox_text("text_terminate_expected_insurance"),
        "expected_insurance_schedule": helper_get_selectbox_text("text_terminate_expected_insurance_schedule")
    };

    create_interviewsub_info("/interviews/api/terminate_sub/", table, data);
}

function do_update_resume(resume_id) {
    data = {
        "id": resume_id,
        "hunting_status": $('#text_terminate_hunting_status').val(),
        "expected_industry": helper_get_selectbox_text("text_terminate_expected_industry"),
        "expected_post": helper_get_selectbox_text("text_terminate_expected_post"),
        "expected_shift": helper_get_selectbox_text("text_terminate_expected_shift"),

        "expected_salary": helper_get_textbox_text("text_terminate_expected_salary"),
        "expected_notes": helper_get_textbox_text("text_terminate_expected_notes"),
        "expected_province": helper_get_textbox_text("text_terminate_expected_province"),
        "expected_city": helper_get_textbox_text("text_terminate_expected_city"),
        "expected_district": helper_get_textbox_text("text_terminate_expected_district"),

        "expected_insurance": helper_get_selectbox_text("text_terminate_expected_insurance"),
        "expected_insurance_schedule": helper_get_selectbox_text("text_terminate_expected_insurance_schedule")
    }
    xhr_common_send('PUT', '/api/resumes/' + resume_id + '/', data)
}

$('#stopFormSubmit').click(function (e) {
    e.preventDefault();
    do_update_resume(resume_selected_value);
    do_stop_submit(interview_selected_value);
    //multisel_submit_wrapper(do_stop_submit);
});


function do_interviewFailResult_submit(interview_id) {
    $('#interviewFailResultModal').modal('hide');
    data = {
        "interview": interview_id,
        "result_type": 3,
        "comments": helper_get_textbox_text("text_interviewresult_comments"),
    };

    // step1: update the interview result
    create_interviewsub_info("/interviews/api/interview_sub/", table, data);
    // step2: the interview stage to next
    submit_interview_by_id(interview_id, "/api/interviews/", 2, '邀约')
}

function do_interviewResult_submit(interview_id) {
    $('#interviewResultModal').modal('hide');
    data = {
        "interview": interview_id,
        "result_type": 3,
        "comments": helper_get_textbox_text("text_interviewresult_comments"),
    };

    // step1: update the interview result
    create_interviewsub_info("/interviews/api/interview_sub/", table, data);
    // step2: the interview stage to next
    submit_interview_by_id(interview_id, "/api/interviews/", 4, 'OFFER', function (res) {
        layer.msg('操作成功')
        page_refresh(table, false)
    })
}


$('#interviewFailResultFormSubmit').click(function (e) {
    e.preventDefault();
    multisel_submit_wrapper(do_interviewFailResult_submit);
});


$('#interviewResultFormSubmit').click(function (e) {
    e.preventDefault();
    multisel_submit_wrapper(do_interviewResult_submit);
});

function do_offerInfo_submit(interview_id) {
    $('#offerModal').modal('hide');
    data = {
        "interview": interview_id,
        "result_type": 3,
        "date": helper_get_textbox_text("text_offerinfo_date"),
        "contact": helper_get_textbox_text("text_offerinfo_contact"),
        "contact_phone": helper_get_textbox_text("text_offerinfo_contact_phone"),
        "address": helper_get_textbox_text("text_offerinfo_address"),
        "postname": helper_get_textbox_text("text_offerinfo_postname"),
        "certification": helper_get_textbox_text("text_offerinfo_certification"),
        "salary": helper_get_textbox_text("text_offerinfo_salary"),
        "notes": helper_get_textbox_text("text_offerinfo_notes")


    };

    // step1:
    create_interviewsub_info("/interviews/api/offer_sub/", table, data);
    // step2:
    submit_interview_by_id(interview_id, "/api/interviews/", 5, '入职')
}

function do_offerInfoUpdate_submit(interview_id) {
    $('#offerUpdateModal').modal('hide');
    data = {
        "interview": interview_id,
        "result_type": 3,
        "date": helper_get_textbox_text("text_update_offerinfo_date"),
        "contact": helper_get_textbox_text("text_update_offerinfo_contact"),
        "contact_phone": helper_get_textbox_text("text_update_offerinfo_contact_phone"),
        "address": helper_get_textbox_text("text_update_offerinfo_address"),
        "postname": helper_get_textbox_text("text_update_offerinfo_postname"),
        "certification": helper_get_textbox_text("text_update_offerinfo_certification"),
        "salary": helper_get_textbox_text("text_update_offerinfo_salary"),
        "notes": helper_get_textbox_text("text_update_offerinfo_notes")

    };
    create_interviewsub_info("/interviews/api/offer_sub/", table, data);
}

$('#offerSubmit').click(function (e) {
    e.preventDefault();
    multisel_submit_wrapper(do_offerInfo_submit);
});

$('#offerUpdateSubmit').click(function (e) {
    e.preventDefault();
    multisel_submit_wrapper(do_offerInfoUpdate_submit);
});

function do_entryed_submit(interview_id) {
    do_common_plain_submit(interview_id, '#entryedModal', 6, '考察');
}

$('#entryedSubmit').click(function (e) {
    e.preventDefault();
    multisel_submit_wrapper(do_entryed_submit);
});

function do_entryUpdate_submit(interview_id) {
    $('#entryUpdateModal').modal('hide');
    //var status = 5;

    data = {
        "interview": interview_id,
        "result_type": 4,
        "date": helper_get_textbox_text("text_entryupdate_date"),
        "contact": helper_get_textbox_text("text_entryupdate_contact"),
        "contact_phone": helper_get_textbox_text("text_entryupdate_contact_phone"),
        "address": helper_get_textbox_text("text_entryupdate_address"),
        "postname": helper_get_textbox_text("text_entryupdate_postname"),
        "certification": helper_get_textbox_text("text_entryupdate_certification"),
        "salary": helper_get_textbox_text("text_entryupdate_salary"),
        "notes": helper_get_textbox_text("text_entryupdate_notes")

    };

    create_interviewsub_info("/interviews/api/offer_sub/", table, data);
}

$('#entryUpdateSubmit').click(function (e) {
    e.preventDefault();
    multisel_submit_wrapper(do_entryUpdate_submit);
});

function do_probationSucc_submit(interview_id) {
    do_common_plain_submit(interview_id, '#probationSuccModal', 7, '回款');
}

// only update the entry info
$('#probationSuccSubmit').click(function (e) {
    e.preventDefault();
    multisel_submit_wrapper(do_probationSucc_submit);
});

function do_probationFail_submit(interview_id) {
    $('#probationFailModal').modal('hide');
    data = {
        "interview": interview_id,
        "result_type": 3,
        "reason": helper_get_textbox_text("text_probation_reason"),
        "comments": helper_get_textbox_text("text_probation_comments")
    };

    /* This is different with other terminate modal, because it contains the probation fail reason */
    // step1:
    create_interviewsub_info("/interviews/api/probation_sub_fail/", table, data);
    // step2:
    stop_interview(interview_id, resume_id, post_selected_value, "/api/interviews/", 6, '考察期-终止');
}

// only update the entry info
$('#probationFailSubmit').click(function (e) {
    e.preventDefault();
    multisel_submit_wrapper(do_probationFail_submit);
});

function do_pbInvoice_submit(interview_id) {
    do_common_plain_submit(interview_id, '#pbInvoiceModal', 7, '回款');
}

// only update the entry info
$('#pbInvoiceSubmit').click(function (e) {
    e.preventDefault();
    multisel_submit_wrapper(do_pbInvoice_submit);
});

function do_pbBaddebt_submit(interview_id) {
    do_common_plain_submit(interview_id, '#pbBaddebtModal', 7, '坏账');
}

// only update the entry info
$('#pbBaddebtSubmit').click(function (e) {
    e.preventDefault();
    multisel_submit_wrapper(do_pbBaddebt_submit);
});

function do_pbFinish_submit(interview_id) {
    $('#pbFinishModal').modal('hide');
    // status = 8
    data = {
        "payback_sub": {
            "interview": interview_id,
            "result_type": 3
        },
        "notes": helper_get_textbox_text("text_pbfinish_notes")
    };

    create_interviewsub_info("/interviews/api/payback_sub_finish/", table, data);
}

// only update the entry info
$('#pbFinishSubmit').click(function (e) {
    e.preventDefault();
    multisel_submit_wrapper(do_pbFinish_submit);
});

function do_pbRegister_submit(interview_id) {
    do_common_plain_submit(interview_id, '#pbRegisterModal', 7, '已经注册');
}

$(function () {
    // only update the entry info
    $('#pbRegisterSubmit').click(function (e) {
        e.preventDefault();
        multisel_submit_wrapper(do_pbRegister_submit);
    });
});

function do_appointment_submit(interview_id) {
    $('#appointmentModal').modal('hide');

    data = {
        "interview": interview_id,
        "result_type": 3,
        "date": helper_get_textbox_text("text_appointment_date"),
        "contact": helper_get_textbox_text("text_appointment_contact"),
        "address": helper_get_textbox_text("text_appointment_address"),
        "postname": helper_get_textbox_text("text_appointment_postname"),
        "certification": helper_get_textbox_text("text_appointment_certification"),
        "attention": helper_get_textbox_text("text_appointment_attention"),
        "first_impression": helper_get_textbox_text("text_appointment_first_impression"),
        "notes": helper_get_textbox_text("text_appointment_notes"),
    };

    /* step1: update the appointment info*/
    create_interviewsub_info("/interviews/api/appointment_sub/", table, data);
    /* step2: update the interview status to next stage*/
    submit_interview_by_id(interview_id, "/api/interviews/", 3, '面试')
}

$('#appointmentSubmit').click(function (e) {
    console.log('点击了400')
    e.preventDefault();
    multisel_submit_wrapper(do_appointment_submit);
});

$('#agree_interview').click(function (e) {
    $('#dailToCandidateModal').modal('hide');
    $('#appointmentModal').modal('show');
});

function do_save_dail_content(interview_id, resume_id) {
    data = {
        "id": resume_id,
        "school": helper_get_textbox_text("candidate_text_resumeinfo_school"),
        "hunting_status": $('#dail_text_cur_hunting_status').val(),
        "expected_industry": helper_get_selectbox_text("dail_text_expected_industry"),
        "expected_post": helper_get_selectbox_text("dail_text_expected_post"),
        "expected_shift": helper_get_selectbox_text("dail_text_expected_shift"),

        "expected_salary": helper_get_textbox_text("dail_text_expected_salary"),
        "expected_notes": helper_get_textbox_text("dail_text_expected_notes"),
        "expected_province": helper_get_textbox_text("dail_text_expected_place_province"),
        "expected_city": helper_get_textbox_text("dail_text_expected_place_city"),
        "expected_district": helper_get_textbox_text("dail_text_expected_place_district"),
        "expected_street": helper_get_textbox_text("dail_text_expected_place_district"),

        "expected_insurance": helper_get_selectbox_text("dail_text_expected_insurance"),
        "expected_insurance_schedule": helper_get_selectbox_text("dail_text_expected_insurance_schedule")
    }
    console.log("data", data)
    xhr_common_send('PUT', '/api/resumes/' + resume_id + '/', data)
}

$('#save_dail_content').click(function (e) {
    e.preventDefault()
    do_save_dail_content(interview_selected_value, resume_selected_value)
});

function do_dial_deeper_submit(interview_id) {
    var status = 2;
    $('#dailToCandidateModal').modal('hide');
    submit_interview_by_id(interview_id, "/api/interviews/", status, '深度沟通');
}

$('#dail_deeper_communicate').click(function (e) {
    e.preventDefault();
    multisel_submit_wrapper(do_dial_deeper_submit);
});

$('#close_dail_content').click(function (e) {
    $('#dailToCandidateModal').modal('hide')
});

function do_dial_not_linked_submit(interview_id) {
    var status = 2;
    $('#dailToCandidateModal').modal('hide');
    submit_interview_by_id(interview_id, "/api/interviews/", status, '未接通');
}

$('#dail_not_linked').click(function (e) {
    e.preventDefault();
    multisel_submit_wrapper(do_dial_not_linked_submit);
});

$('#giveup_interview').click(function (e) {
    $('#dailToCandidateModal').modal('hide');
    do_save_dail_content(interview_selected_value, resume_selected_value)
    do_stop_submit(interview_selected_value);
    //show_stop_modal(interview_selected_value, resume_selected_value)
});

// ================================ CLICKS END ================================================
//-------- select
xhr_common_send('GET', '/interview/ai/task', null, function (response) {
    $('#ai_task_id').html("")
    $('#ai_task_id').prepend('<option value="">请选择任务</option>');
    if (response != '') {
        $.each(response.ai_taskId, function (index, ele) {
            $('#ai_task_id').append('<option value="ai_task_id' + index + '">' + ele + '</option>');
        });
    }
})
//-----------
// });

