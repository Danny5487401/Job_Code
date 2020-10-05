var resumeId = -1
var experience_id = -1
var on_experience_add = false
var exp_map = {}

$(document).ready(function() { 
    resumeId = $('#resumeInfo').attr('resumeId')
    console.log("basicInfo resumeId(", resumeId, ")")
    GetBasicInfo()
});

$(document).on('click', '#userBasicEditButton', function() {

    GetBasicInfo()
    $('#userBasicHeader').css('background-color', '#66FFFF')
    $('#userBasicEditPanel').css('display', 'block') // Attention here: block not inline
    $('#userBasicShowPanel').css('display', 'none')

    $('#userBasicEditButton').css('display', 'none')
    $('#userBasicSaveButton').css('display', 'inline')
});

$(document).on('click', '#userBasicSaveButton', function() {

    console.log("------------------> click update")
    $('#frame_address_text').text('正在计算..')
    UpdateBasicInfo()
    // $('#userBasicHeader').css('background-color', '#FFFFFF')
    // $('#userBasicEditPanel').css('display', 'none')
    // $('#userBasicShowPanel').css('display', 'block')
    //
    // $('#userBasicEditButton').css('display', 'inline')
    // $('#userBasicSaveButton').css('display', 'none')

    GetBasicInfo()

    layer.msg('保存成功')
});


$(document).on('click', '#userBasicAddButton', function() {

    console.log("------------------> click add")
   // $('#frame_address_text').text('正在计算..')
    AddBasicInfo()
    // $('#userBasicHeader').css('background-color', '#FFFFFF')
    // $('#userBasicEditPanel').css('display', 'none')
    // $('#userBasicShowPanel').css('display', 'block')
    //
    // $('#userBasicEditButton').css('display', 'inline')
    // $('#userBasicSaveButton').css('display', 'none')

   // GetBasicInfo()

    layer.msg('添加成功')
});

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

$(document).on('click', '#saveAnswerBtn', function() {
    var answer = $('#answer').val()
    console.log(window.location.href)
    var iid = getQueryVariable("interview_id")
    if(!iid || iid == "" || isNaN(iid)){
        layer.msg("请先通过至邀约状态再保存");
        return false
    }
    $.ajax({
        url: '/api/replyQuestion',
        type: 'POST',
        data: {
            answer:answer,
            interview_id:iid
        },
        success: function(res) {
            layer.msg(res)
        }
    });
});




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
             "filter": keyword == '宝山区' ? "310113":"",
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

function wordgjTwice(sendbbbName, outi, mapname) {

    var map = new BMap.Map(mapname);
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
        var cIdName = outi;
        var transit = new BMap.TransitRoute(map, {
            renderOptions: {map: map, panel: cIdName},
            pageCapacity: 1
        });
        console.log('一渲染')

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

function wordgjFirst(sendaaaName, fbbbName, outi, mapname) {
    var map = new BMap.Map(mapname);
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
        wordgjTwice(fbbbName, outi, mapname);
    }

    var local = new BMap.LocalSearch(map, {
        onSearchComplete: myFun
    });
    local.search(sendaaaName);
};

function copyText(startHome, geName, outi, mapname) {
    G_numi = 1;
    //线上
    console.log(startHome, geName)
    wordgjFirst(startHome, geName, outi, mapname);
}

var localTimer;

//ops append
var addrExists = []

function GetBasicInfo(rid) {
  
    rid = rid || resumeId
    xhr_common_send('GET', '/api/resumes/' + rid + '/', null, function (response) {
      console.log(response)
      gender = '男'
      if (response.gender == 'f') {
          gender = '女'
      }

      degree = ''

      if (response.degree == 1) {
          degree = '小学'
      } else if (response.degree == 2) {
          degree = '初中'
      } else if (response.degree == 3) {
          degree = '高中'
      } else if (response.degree == 4) {
          degree = '中专'
      } else if (response.degree == 5) {
          degree = '大专'
      } else if (response.degree == 6) {
          degree = '本科'
      } else if (response.degree == 7) {
          degree = '硕士'
      } else if (response.degree == 8) {
          degree = '博士'
      } else if (response.degree == 9) {
          degree = '博士后'
      }

      console.log("To Update Panel", degree, gender)
      // Update the show panel info
      $('#userBasicShowName').html(response.username)
      $('#userBasicShowGendor').html(gender)
      $('#userBasicShowAge').html(response.age)
      $('#userBasicShowDegree').html(degree)
      $('#userBasicShowGraduate').html()
        var cursite = response.cursettle || '';
              console.log('现居住地',cursite)
      $('#userBasicShowCurResidence').html("现居住地 : " + cursite)
      $('#userBasicShowBirthPlace').html("籍贯 : " + response.birthorigin)

      $('#userBasicShowPhone').html("" + response.phone_number)

      // Update the edit panel info
      $('#userBasicEditName').val(response.username)
      $('#userBasicEditGendor').val(gender)

        //append age sel
              $('#userBasicEditAge').empty();
        $('#userBasicEditAge').append('<option value=""></option>')
        for (var year = 100; year >= 1; year--) {
            var opt = `<option value="${year}">${year}</option>`
            $('#userBasicEditAge').append(opt)
        }

      $('#userBasicEditAge').val(response.age)
      $('#userBasicEditDegree').val(degree)


        //render
        $('#userBasicEditGraduate').empty();
        $('#userBasicEditGraduate').append('<option value=""></option>')

        for (var year = 2020; year >= 1970; year--) {
            var opt = `<option value="${year}">${year}</option>`
            $('#userBasicEditGraduate').append(opt)
        }


        $('#userBasicEditGraduate').val(response.graduate_year)
      $('#userBasicEditPhone').val(response.phone_number)
      $('#userBasicEditLiveState').val(response.live_state)


        //使用组件赋值
        $('#distpicker').distpicker({
            province: response.birth_province,
            city: response.birth_city,
            district: response.birth_district
        });
        // $('#userBasicEditBirthProvince').val(response.birth_province)
        // $('#userBasicEditBirthCity').val(response.birth_city)
        // $('#userBasicEditBirthDistrict').val(response.birth_district)
      $('#userBasicEditBirthStreet').val(response.birth_street)


        console.log('distpicker1', $('#distpicker1'))
            $('#distpicker1').distpicker("destroy")

        $('#distpicker1').distpicker({
            province: response.current_settle_province || '',
            city: response.current_settle_city || '',
            district: response.current_settle_district || ''
        });

       var joinStr = response.current_settle_province + response.current_settle_city + response.current_settle_district + response.current_settle_street;
        if (response.current_settle_province == '') {
            joinStr = '无'
        }
        console.log('赋值现居住地',response.current_settle_province + response.current_settle_city + response.current_settle_district + response.current_settle_street)
        $('#userBasicShowExpectPlace').html("期望工作地 : " + joinStr)

        // $('#userBasicEditCurSettleProvince').val(response.current_settle_province)
        // $('#userBasicEditCurSettleCity').val(response.current_settle_city)
        // $('#userBasicEditCurSettleDistrict').val(response.current_settle_district)


        if (response.current_settle_district) {
            getStreets('userBasicEditCurSettleStreet', response.current_settle_district, function () {
                // $('#street_id').val(res.address_street)
                $('#userBasicEditCurSettleStreet').val(response.current_settle_street)
            })
        }

        var project_info = JSON.parse(localStorage.getItem("project_info"))
        console.log('project_info', project_info)
        var project_addr =
            project_info.address_city + project_info.address_district
            + project_info.address_street + project_info.address_suite

        console.log('project_addr', project_addr)


        //判断省市区街道信息是否齐全
        // workexp_list
        if (response.current_settle_province != "" && response.current_settle_city != "" && response.current_settle_district != "" && response.current_settle_street != "") {
            //frame_address
            var targetAddr = response.current_settle_city + response.current_settle_district + response.current_settle_street + response.current_settle_xx
            // setTimeout(function () {
            if (response.current_settle_city == project_info.address_city) {


                copyText(project_addr, targetAddr, 'frame_address', 'l-map')

                function renderText() {
                    console.log('开始')
                    var text = $('div#frame_address div.trans-title').find('p').eq(1).text()
                    if (text) {
                        $('#frame_address_text').text(text)
                    }
                }

                // localTimer.clearInterval();

                setTimeout(renderText, 3000)

                function randomString(len) {
                    len = len || 32;
                    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
                    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
                    var maxPos = $chars.length;
                    var pwd = '';
                    for (var i = 0; i < len; i++) {
                        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
                    }
                    return pwd;
                }

                //获得项目的额外地址
                var extra_address = project_info.extra_address
                console.log('extra_address', extra_address)
                if (extra_address && extra_address != '') {
                    extra_address = JSON.parse(extra_address)
                    var idx = 1
                    for (var extra of extra_address) {
                        console.log('extra ,', extra)
                        if (extra.district_id != '' && extra.street_id != '' && extra.address_suite != '') {
                            console.log('render before')
                            var addr = project_info.address_city + extra.district_id + extra.street_id + extra.address_suite
                            console.log('addr', addr)
                            //
                            var eleVal = $('#' + addr).val()
                            if (typeof eleVal !== 'undefined') {
                                // continue
                            }

                            //从basemap追加
                            var randomStr = randomString(6)
                            var inner = `<div class="layui-timeline-content layui-text">
                    <h5 class="layui-timeline-title">【${extra.addr_tag || ''}】${addr}【${extra.zp_status}】:距离计算:</h5>
                    <p id="frame_address_text${randomStr}" style="color: #f7c837">正在计算..</p>
                    <div id="frame_address${randomStr}" style="display:none;width: 200px;height: auto;background-color: white">
                        地址初始值:
                    </div>
                    <div id="l-map${randomStr}" style="display: none"></div>
                    <div id="r-result${randomStr}" style="background-color: yellowgreen;display: none">1111111111</div>

                </div>`
                            var html = `
                            <li id="${addr}" class="layui-timeline-item">
                            ${inner}
                            </li>
                            `;

                            if (typeof eleVal !== 'undefined') {
                                $('#' + addr).html(inner)
                            } else {
                                $('#base_map').after(html)
                            }


                            console.log('append ed')


                            var fn = function (addr, targetAddr, randomStr, idx) {
                                setTimeout(function () {
                                    copyText(addr, targetAddr, 'frame_address' + randomStr, 'l-map' + randomStr)

                                }, idx * 1000)
                            }

                            fn(addr, targetAddr, randomStr, idx)


                            // localTimer.clearInterval();

                            var fnn = function (randomStr, idx) {

                                setTimeout(function () {
                                    var text = $('div#frame_address' + randomStr + ' div.trans-title').find('p').eq(1).text()
                                    console.log('timeout text:', text)
                                    if (text) {
                                        $('#frame_address_text' + randomStr).text(text)
                                    }
                                }, 3000 + idx * 1000)
                            }

                            fnn(randomStr, idx)


                        }
                        idx++
                    }

                }



            } else {
                $('#frame_address_text').text('距离过远，无法计算')
                // if (response.workexp_list.length > 0 && response.workexp_list[0] != '') {
                //     nextLogic(project_addr, response.workexp_list[0], project_info.address_city)
                // }
            }
            // }, 1000)
        } else {
            //根据最近一份工作 查地址
            // if (response.workexp_list.length > 0 && response.workexp_list[0] != '') {
            //     nextLogic(project_addr, response.workexp_list[0], project_info.address_city)
            // }
        }



        // $('#userBasicEditCurSettleStreet').val(response.current_settle_street)
        //

        console.log(312);
                    $('#distpicker2').distpicker("destroy")
        $('#distpicker2').distpicker({
            province: response.expected_province,
            city: response.expected_city,
            district: response.expected_district
        });

        // $('#userBasicEditExpectProvince').val(response.expected_province)
        // $('#userBasicEditExpectCity').val(response.expected_city)
        // $('#userBasicEditExpectDistrict').val(response.expected_district)
      $('#userBasicEditExpectStreet').val(response.expected_street)

	})
}

function nextLogic(startHome, com_name, city) {
    $.ajax({
        type: "GET",
        url: `https://api.81api.com/fuzzyQueryCompanyInfo/${com_name}/`,
        // dataType: "jsonp",
        // jsonp: "callback",
        headers: {'Authorization': "APPCODE " + 'ba0b5b1ecfd24a6eaa8c1234de7978b3'},
        data: {},
        success: function (data) {
            console.log(data)
            if (data.status != 200) {
                layer.msg('地图请求失败,请检查appcode是否过期')
                return false
            }
            if (data.data.list.length > 0) {
                $.ajax({
                    type: "GET",
                    url: `http://api.81api.com/getCompanyBaseInfo/${data.data.list[0].name}/`,
                    // dataType: "jsonp",
                    // jsonp: "callback",
                    headers: {'Authorization': "APPCODE " + 'ba0b5b1ecfd24a6eaa8c1234de7978b3'},
                    data: {},
                    success: function (data) {
                        console.log(data)
                        if (!data.status) {
                            layer.msg('公司年报查询为空')
                            return false
                        }
                        if (data.data.registerData.address) {
                            if (data.data.registerData.address.includes(city)) {
                                copyText(startHome, data.data.registerData.address)
                                layer.msg('根据上份工作地址查询成功')
                            }else{
                                layer.msg('上次工作距离过远')
                            }

                        }
                    }
                    ,
                    error: function (err) {
                        console.log('err', err)
                    }
                })
            } else {
                layer.msg('未查询到对应公司')
            }
        },
        error: function (err) {
            console.log('err', err)
        }
    })
}

function AddBasicInfo(rid) {
    $.ajax({
        "url": "/api/resumes/",
        "type": "POST",
        "data": $('#post_filter_form').serialize(),
    });
}

function UpdateBasicInfo(rid) {
    rid = rid || resumeId
    // Parsing the basic info and update
    var data = {}
    if ($('#userBasicEditName').val().length != 0) {
        data['username'] =  $('#userBasicEditName').val()
    } else {
        console.log("username ", $('#userBasicEditName').val())
    }

    if ($('#userBasicEditAge').val().length != 0) {
        data['age'] = parseInt($('#userBasicEditAge').val())
    }

    if ($('#userBasicEditGendor').val() == '男') {
        data['gender'] = 'm'
    } else if ($('#userBasicEditGendor').val() == '女') {
        data['gender'] = 'f'
    }

    if ($('#userBasicEditDegree').val() == '小学') {
        data['degree'] = 1
    } else if ($('#userBasicEditDegree').val() == '初中') {
        data['degree'] = 2
    } else if ($('#userBasicEditDegree').val() == '高中') {
        data['degree'] = 3 
    } else if ($('#userBasicEditDegree').val() == '中专') {
        data['degree'] = 4
    } else if ($('#userBasicEditDegree').val() == '大专') {
        data['degree'] = 5 
    } else if ($('#userBasicEditDegree').val() == '本科') {
        data['degree'] = 6
    } else if ($('#userBasicEditDegree').val() == '硕士') {
        data['degree'] = 7
    } else if ($('#userBasicEditDegree').val() == '博士') {
        data['degree'] = 8
    } else if ($('#userBasicEditDegree').val() == '博士后') {
        data['degree'] = 9 
    }
    if ($('#userBasicEditBirthProvince').val() != '') {
        data['birth_province'] = $('#userBasicEditBirthProvince').val()
    }
    if ($('#userBasicEditBirthCity').val() != '') {
        data['birth_city'] = $('#userBasicEditBirthCity').val()
    }
    if ($('#userBasicEditBirthDistrict').val() != '') {
        data['birth_district'] = $('#userBasicEditBirthDistrict').val()
    }
    if ($('#userBasicEditBirthStreet').val() != '') {
        data['birth_street'] = $('#userBasicEditBirthStreet').val()
    }

    if ($('#userBasicEditCurSettleProvince').val() != '') {
        data['current_settle_province'] = $('#userBasicEditCurSettleProvince').val()
    }
    if ($('#userBasicEditCurSettleCity').val() != '') {
        data['current_settle_city'] = $('#userBasicEditCurSettleCity').val()
    }
    if ($('#userBasicEditCurSettleDistrict').val() != '') {
        data['current_settle_district'] = $('#userBasicEditCurSettleDistrict').val()
    }
    if ($('#userBasicEditCurSettleStreet').val() != '') {
        data['current_settle_street'] = $('#userBasicEditCurSettleStreet').val()
    }
    if ($('#userBasicEditCurSettleXx').val() != '') {
        data['current_settle_xx'] = $('#userBasicEditCurSettleXx').val()
    }


    if ($('#userBasicEditExpectProvince').val() != '') {
        data['expected_province'] = $('#userBasicEditExpectProvince').val()
    }
    if ($('#userBasicEditExpectCity').val() != '') {
        data['expected_city'] = $('#userBasicEditExpectCity').val()
    }
    if ($('#userBasicEditExpectDistrict').val() != '') {
        data['expected_district'] = $('#userBasicEditExpectDistrict').val()
    }
    if ($('#userBasicEditExpectStreet').val() != '') {
        data['expected_street'] = $('#userBasicEditExpectStreet').val()
    }
    if ($('#userBasicEditGraduate').val() != '') {
        data['graduate_year'] = $('#userBasicEditGraduate').val()
    }

    if ($('#userBasicEditPhone').val() != '') {
        data['phone_number'] = Number($('#userBasicEditPhone').val())
    }

    if ($('#userBasicEditPhone').val() != '') {
        data['live_state'] = Number($('#userBasicEditLiveState').val())
    }
    /*
    var data = {
      "graduate": $('#userBasicEditGraduate').val(),
    }
    */

    console.log("Prepare to update the resume Info data:", data)
    xhr_common_send('PUT', '/api/resumes/' + rid + '/', data, function (response) {
		console.log("success update resume Info")
        GetBasicInfo(rid)
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

function xhr_common_send(method, url, data, succCallback=null) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);

  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

  var csrftoken = getCookie('csrftoken');

  xhr.setRequestHeader("X-CSRFToken", csrftoken);
  console.log("------------------------------------>")

  xhr.onreadystatechange=function() {
    if (xhr.readyState === 4){ //if complete
      // 2xx is ok, ref: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
      if(xhr.status >= 200 && xhr.status < 300) {
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
