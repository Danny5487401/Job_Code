# -*- coding: utf-8 -*- from __future__ import unicode_literals

from django.shortcuts import render
from django.views import generic
import logging

logger = logging.getLogger('django')
from django.core.files.storage import FileSystemStorage
import time
import json
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets, status
import random
# Create your views here.
from resumes.models import LabelLib, Resume
from interviews.models import Interview

from .models import Company, Department, Post, query_posts_by_args
from .serializers import CompanySerializer, DepartmentSerializer, PostSerializer

from ordov.choices import (DEGREE_CHOICES, DEGREE_CHOICES_MAP)

from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

from rest_framework import permissions
from accounts.models import UserProfile
from django.contrib.auth.models import User
from permissions.models import ProjectPermission


class CompanyView(APIView):
    def get(self, request):
        companies = Company.objects.all()

        serializer = CompanySerializer(companies, many=True)
        return Response({"companies": serializer.data})

    def post(self, request):
        company = request.data.get('company')

        serializer = CompanySerializer(data=company)
        if serializer.is_valid(raise_exception=True):
            company_saved = serializer.save()

        return Response(
            {"success": "Company '{}' created successfully".format(company_saved.name)}
        )


class DepartmentView(APIView):
    def get(self, request):
        departments = Department.objects.all()

        serializer = DepartmentSerializer(departments, many=True)
        return Response({"departments": serializer.data})

    def post(self, request):
        department = request.data.get('department')

        serializer = DepartmentSerializer(data=department)
        if serializer.is_valid(raise_exception=True):
            department_saved = serializer.save()

        return Response(
            {"success": "Department '{}' created successfully".format(department_saved.name)}
        )


class PostView(APIView):
    def get(self, request):
        posts = Post.objects.all()

        serializer = PostSerializer(posts, many=True)
        return Response({"posts": serializer.data})

    def post(self, request):
        post = request.data.get('post')

        serializer = PostSerializer(data=post)
        if serializer.is_valid(raise_exception=True):
            post_saved = serializer.save()

        return Response(
            {"success": "Post '{}' created successfully".format(post_saved.name)}
        )


class IsCreationOrIsAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        print("User:", request.user.username, request.user.password)
        if request.user.is_authenticated is not True:
            print("user.is_authenticated", request.user.is_authenticated)
            return False
        userProfile = UserProfile.objects.get(user=request.user)
        if userProfile.user_type == "Manager":
            return True;
        elif userProfile.user_type == "Recruiter" or userProfile.user_type == "Candidate" or userProfile.user_type == "Employer":
            """
            post_id = int(request.query_params.get('post_id', -999))
            if post_id == -999:
                return False
            status_id = int(request.query_params.get('status_id', -999))
            if status_id == -999:
                return False
            """
            # permission = ProjectPermission.objects.get(post=post_id, stage=status_id, user=userProfile)
            permission = ProjectPermission.objects.filter(user=userProfile)
            if (permission):
                return True
            else:
                print("No Found Permission", userProfile)
                return False
        else:
            print("Fail")
            return False
        return False


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('finished')
    serializer_class = PostSerializer
    permission_classes = (IsCreationOrIsAuthenticated,)

    def list(self, request, **kwargs):
        post = query_posts_by_args(request.user, **request.query_params)

        # Could only show the user
        # This Post should be

        serializer = PostSerializer(post['items'], many=True)
        result = dict()

        result['data'] = serializer.data
        tds = result['data']

        for td in tds:
            td.update({'DT_RowId': td['id']})

        result['draw'] = post['draw']
        result['recordsTotal'] = int(post['total'])
        result['recordsFiltered'] = int(post['count'])

        return Response(result, status=status.HTTP_200_OK, template_name=None, content_type=None)


# 编辑项目
def edit_post_page(request):
    id = request.GET['id']
    print('编辑项目')
    book = Post.objects.all().filter(id=id)
    print(book)
    data = {}
    data['data'] = json.loads(serializers.serialize("json", book))
    return render(request, 'companies/table_edit_posts.html', data)


@csrf_exempt
def project_info(request):
    id = request.GET['id']
    print('编辑项目')
    book = Post.objects.all().filter(id=id)
    data = {}
    for b in book:
        hangyeleibie_arr = []
        if b.hangyeleibie is not None and b.hangyeleibie != '':
            for hy in b.hangyeleibie.split('|'):
                if hy == '':
                    break
                lb = LabelLib.objects.get(id=int(hy))
                hangyeleibie_arr.append(lb.name)
            data['hangyeleibie'] = "|".join(hangyeleibie_arr)

        gangweileibie_arr = []
        if b.gangweileibie is not None and b.gangweileibie != '':
            for hy in b.gangweileibie.split('|'):
                if hy == '':
                    break
                lb = LabelLib.objects.get(id=int(hy))
                gangweileibie_arr.append(lb.name)
            data['gangweileibie'] = "|".join(gangweileibie_arr)

        gangweitezheng_arr = []
        if b.gangweitezheng is not None and b.gangweitezheng != '':
            for hy in b.gangweitezheng.split('|'):
                if hy == '':
                    break
                lb = LabelLib.objects.get(id=int(hy))
                gangweitezheng_arr.append(lb.name)
            data['gangweitezheng'] = ",".join(gangweitezheng_arr)

        # lb = LabelLib.objects.get(id=int(b.gangweijibie))
        data['gangweijibie'] = b.gangweijibie

        # lb = LabelLib.objects.get(id=int(b.gangweizuoxi))
        data['gangweizuoxi'] = b.gangweizuoxi

        # lb = LabelLib.objects.get(id=int(b.shebaogongjijin))
        data['shebaogongjijin'] = b.shebaogongjijin

        data['xinzidaiyu'] = b.xinzidaiyu

    print(book)
    data['data'] = json.loads(serializers.serialize("json", book))
    return JsonResponse(data)


class PostTable(generic.ListView):
    context_object_name = 't_post_list'
    template_name = 'companies/table_posts.html'

    def get_queryset(self):
        return Post.objects.all()

    def get_context_data(self, **kwargs):
        context = super(PostTable, self).get_context_data(**kwargs)
        context['template_table_name'] = 'Post'
        return context


# TODO: This is a temporary method for update resume from ajax
# and would be removed afterwards


# 备用一个上传文件返回地址的api
def uploadFile(request, fileName):
    uploaded_file_url = ""
    if request.method == 'POST' and not len(request.FILES) is 0 and not len(request.FILES[fileName]) is 0 and \
            request.FILES[fileName]:
        excel_file = request.FILES[fileName]

        now = int(round(time.time() * 1000))
        nowStr = time.strftime('File-%Y-%m-%d-%H-%M-%S-', time.localtime(now / 1000))
        store_name = nowStr + excel_file.name

        fs = FileSystemStorage()
        filename = fs.save(store_name, excel_file)

        # Main logic: Parse the excel
        # PROJECT_DIR = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))

        uploaded_file_url = fs.url(filename)
        # load_excel.load_excel(PROJECT_DIR+uploaded_file_url)

    return uploaded_file_url


DEGREE_DICT = {
    0: '', 1: '小学', 2: '初中', 3: '高中', 4: '中专', 5: '大专', 6: '本科', 7: '硕士', 8: '博士', 9: '博士后'
}

GENDER = {
    'm': '男',
    'f': '女'
}


@csrf_exempt
def job(request, post_id):
    post = Post.objects.get(id=post_id)
    post.degree_min = DEGREE_DICT.get(post.degree_min, '')
    post.degree_max = DEGREE_DICT.get(post.degree_max, '')

    hangyeleibie_arr = []
    if post.hangyeleibie is not None and post.hangyeleibie != '':
        for hy in post.hangyeleibie.split('|'):
            if hy == '':
                break
            lb = LabelLib.objects.get(id=int(hy))
            hangyeleibie_arr.append(lb.name)
        post.hangyeleibie = "|".join(hangyeleibie_arr)

    return render(request, 'companies/job.html', {
        "post": post,
    })

# 创建企业，在allin后台点击注册，跳转这个页面，创建好再去跳转登陆
@csrf_exempt
def create_company(request):

    return render(request, 'companies/reg.html', {

    })


# 点击生成公司信息和企业账户，手机号是用户名
@csrf_exempt
def create_company_post(request):
    extra_company_info = request.POST
    logger.info(extra_company_info)



@csrf_exempt
def job_commit(request):
    post_id = request.POST.get('post_id', '')
    username = request.POST.get('username', '')
    phone_number = request.POST.get('phone_number', '')
    status = request.POST.get('status', '')
    status = int(status)

    post = Post.objects.get(id=int(post_id))
    resume = Resume.objects.get(username=username, phone_number=int(phone_number))
    logger.info("resume={}".format(resume))
    interview = None
    if status == 2:
        try:
            interview = Interview.objects.get(post=post, resume=resume)
        except:
            logger.info("interview为空")
        logger.info("interview={}".format(interview))
        if interview is None:
            interview = Interview(
                is_active=True,
                post=post,
                result="Pending",
                resume=resume,
                status=2,
                sub_status="感兴趣"
            )
            interview.save()
            logger.info("新建interview")
        else:
            logger.info("开始修改，当前status {}".format(interview.status))
            if interview.status < 2:
                interview.status = 2
                interview.sub_status = '感兴趣'
                interview.save()
                logger.info("保存成功")
    elif status == 8:
        try:
            interview = Interview.objects.get(post=post, resume=resume)
        except:
            pass
        if interview is None:
            interview = Interview(
                is_active=False,
                post=post,
                result="Stopped",
                resume=resume,
                status=8,
                sub_status="不感兴趣"
            )
            interview.save()
        else:
            interview.status = 8
            interview.result = 'Stopped'
            interview.is_active = False
            interview.sub_status = '不感兴趣'
            interview.save()
    return HttpResponse("操作成功")


@csrf_exempt
def UpdatePost(request):
    print('isreq')
    if request.method == 'POST':
        print('ispost')
        # 处理邀约录音和offer录音
        # invite_voice , offer_voice
        invite_voice = uploadFile(request, "invite_voice")
        offer_voice = uploadFile(request, "offer_voice")

        keywords = ""
        if len(request.POST['keywords']) > 0:
            keywords = request.POST['keywords']

        # 直接追加字段
        extra_address = request.POST.get('extra_address', '')

        question = request.POST.get('question', '')

        company_name = request.POST['company_name']
        department_name = request.POST['department_name']
        post_name = request.POST['post_name']
        baiying_task = request.POST['baiying_task_id']
        p_type = request.POST.get('post_type', '')
        talk_hint = request.POST['talk_hint']
        prologue = request.POST['prologue']
        workplace = request.POST['workplace']
        work_purpose = request.POST['work_purpose']
        wechat_invite = request.POST['wechat_invite']

        yaoyuemuban = request.POST['yaoyuemuban']
        mianshimuban = request.POST['mianshimuban']
        offermuban = request.POST['offermuban']       

        province = request.POST['working_place_province']
        city = request.POST['working_place_city']
        district = request.POST['working_place_district']
        address_suite = request.POST['address_suite']
        street = request.POST.get('working_place_street', '')
        print('street')
        print(street)

        # 要求json
        yaoqiu = request.POST.get('yaoqiu', '')

        # 开始处理label新字段

        # 行业类别
        hangyeleibie = request.POST.get('hangyeleibie', '')
        if hangyeleibie is not None and hangyeleibie != '':
            hyids = []
            hangye_arr = hangyeleibie.split('|')
            for hy in hangye_arr:
                lb = LabelLib.objects.get(deleted=0, name=hy, kind='hangyeleibie')
                hyids.append(str(lb.id))
            print('hyids', hyids)
            hangyeleibie = '|'.join(hyids)

        # 岗位类别
        gangweileibie = request.POST.get('gangweileibie', '')
        if gangweileibie is not None and gangweileibie != '':
            gwids = []
            gangwei_arr = gangweileibie.split('|')
            for gw in gangwei_arr:
                lb = LabelLib.objects.get(deleted=0, name=gw, kind='gangweileibie')
                gwids.append(str(lb.id))
            gangweileibie = '|'.join(gwids)

        # 岗位级别
        gangweijibie = request.POST.get('gangweijibie', '')
        if gangweijibie is not None and gangweijibie != '':
            gw = LabelLib.objects.get(id=gangweijibie, kind='gangweijibie')
            gangweijibie = gw.id

        # 岗位作息
        gangweizuoxi = request.POST.get('gangweizuoxi', '')
        if gangweizuoxi is not None and gangweizuoxi != '':
            gw = LabelLib.objects.get(id=gangweizuoxi, kind='gangweizuoxi')
            gangweizuoxi = gw.id

        # 社保公积金
        shebaogongjijin = request.POST.get('shebaogongjijin', '')
        if shebaogongjijin is not None and shebaogongjijin != '':
            gw = LabelLib.objects.get(id=shebaogongjijin, kind='shebaogongjijin')
            shebaogongjijin = gw.id
        # 岗位特征
        gangweitezheng = request.POST.get('gangweitezheng', '')
        if gangweitezheng is not None and gangweitezheng != '':
            gwids = []
            gangwei_arr = gangweitezheng.split(',')
            for gw in gangwei_arr:
                lb = LabelLib.objects.get(deleted=0, name=gw, kind='gangweitezheng')
                gwids.append(str(lb.id))
            gangweitezheng = '|'.join(gwids)
        # 薪资待遇
        xinzidaiyu = request.POST.get('xinzidaiyu', '')

        # 2020年04月12日22:31:12 不需要岗位类别了，已经用选择框替代了
        if company_name == "" or department_name == "" or post_name == "":  # or p_type == "":
            print('fail1')
            return HttpResponse("请完善公司信息")

        if province == "" and city == "":  # and district == "":
            print('fail2')
            return HttpResponse("请完善省市信息")
        #
        # if address_suite == "":
        #     return HttpResponse('请输入公司详细地址')

        # bid = str(random.randint(100, 99999))
        #
        # baiying_task = "测试百应3-{}".format(bid)

        baiying_task_name = ''
        baiying_task_id = 0

        # 修改为百应任务非必填项
        if baiying_task is not None and baiying_task != '':
            baiying_fields = baiying_task.split('-')
            if len(baiying_fields) < 2:
                print('fail3')
                return HttpResponse("请选择百应任务")
            baiying_task_name = baiying_fields[0]
            baiying_task_id = baiying_fields[1]

            # 判断百应任务是否存在
            baiying_exists = Post.objects.all().filter(baiying_task_id=baiying_task_id)
            if baiying_exists and len(baiying_exists) > 0:
                # 如果是edit 且重复选择 则不判断重复
                id = request.POST.get('id')
                # print('id = ' + id)
                if id:
                    post = Post.objects.get(id=id)
                    if post.baiying_task_id != int(baiying_task_id):
                        print('判断是否存在:', post.baiying_task_id, '2:', baiying_task_id)
                        return HttpResponse("百应任务已存在")
                else:
                    return HttpResponse("百应任务已存在")

        min_degree = request.POST.get('degree_id_min', '不限')
        max_degree = request.POST.get('degree_id_max', '不限')
        min_age = request.POST['age_id_min']
        max_age = request.POST['age_id_max']
        graduate_start = request.POST.get('graduate_time_start', '不限')
        graduate_end = request.POST.get('graduate_time_end', '不限')

        gender = request.POST['gender_id']
        salary = request.POST['min_salary_id']
        linkman_name = request.POST['linkman_name']
        linkman_phone = request.POST['linkman_phone']

        # 修改project_name的组合方式
        project_name = company_name + "-" + province + city + district + "-" + post_name  # request.POST.get('gangweileibie',
        #       '')  # p_type
        ageMin = 0
        if not request.POST['age_id_min'] == "":
            ageMin = int(request.POST['age_id_min'])
        ageMax = 100
        if not request.POST['age_id_max'] == "":
            ageMax = int(request.POST['age_id_max'])

        print('min_degree')
        print(min_degree)
        print('max_degree')
        print(max_degree)
        degreeMin = DEGREE_CHOICES_MAP.get(min_degree, 0)
        degreeMax = 100
        if not max_degree.find(u'不限') >= 0:
            degreeMax = DEGREE_CHOICES_MAP.get(max_degree, 100)

        graduate_S = 0
        if not graduate_start == "" and graduate_start.find(u'不限') < 0:
            graduate_S = int(graduate_start)
        graduate_E = 2080
        if not graduate_end == "" and graduate_end.find(u'不限') < 0:
            graduate_E = int(graduate_end)

        salary_offer = request.POST['min_salary_id']

        resume_latest_modified = request.POST['resume_latest_modified']

        post_info = {
            "department": {
                "description": "",
                "company": {
                    "c_type": "",
                    "name": company_name,
                    "scale": 0,
                    "area": "",
                    "description": "",
                    "short_name": company_name
                },
                "name": department_name
            },
            "description": post_name,
            "name": post_name,
            "address_province": province,
            "address_city": city,
            "address_district": district,
            "address_street": street,
            "salary_offer": salary_offer
        }
        """
        Do Not Use the serializer here
        """
        companyTarget = None
        departTarget = None
        postTarget = None
        company_info = {
            "c_type": "",
            "name": company_name,
            "scale": 0,
            "area": "",
            "description": "",
            "short_name": company_name
        }
        department_info = {
            "description": "",
            "name": department_name
        }
        post_info = {
            "description": post_name,
            "name": post_name,
            "degree": DEGREE_CHOICES_MAP.get(min_degree),
            "degree_min": degreeMin,
            "degree_max": degreeMax,
            "address_province": province,
            "address_city": city,
            "address_district": district,
            "address_street": street,
            "age_min": ageMin,
            "age_max": ageMax,
            "graduatetime_min": graduate_S,
            "graduatetime_max": graduate_E,
            "salary_offer": salary_offer,
            "gender": gender,
            "linkman": linkman_name,
            "linkman_phone": linkman_phone,
            "project_name": project_name,
            "p_type": p_type,
            "baiying_task_name": baiying_task_name,
            "baiying_task_id": baiying_task_id,
            "resume_latest_modified": resume_latest_modified,
            "talk_hint": talk_hint,
            "prologue": prologue,
            "workplace": workplace,
            "work_purpose": work_purpose,
            "wechat_invite": wechat_invite,

            "yaoyuemuban": yaoyuemuban,
            "mianshimuban": mianshimuban,
            "offermuban": offermuban,


            "invite_voice": invite_voice,
            "offer_voice": offer_voice,
            "keywords": keywords,

            "level": "",

            # 是否结束
            "finished": 0,

            "yaoqiu": yaoqiu,
            # append
            "hangyeleibie": hangyeleibie,
            "gangweileibie": gangweileibie,
            "gangweijibie": gangweijibie,
            "gangweizuoxi": gangweizuoxi,
            "shebaogongjijin": shebaogongjijin,
            "gangweitezheng": gangweitezheng,
            "xinzidaiyu": xinzidaiyu,
            "address_suite": address_suite,
            "extra_address": extra_address,
            "question": question
        }

        id = request.POST.get('id')
        # print('id = ' + id)
        if id:
            post = Post.objects.get(id=id)
            company = Company.objects.get(pk=post.company_id)
            # print(company)
            companyTarget, created = Company.objects.update_or_create(**company_info)
            departmentTarget, created = Department.objects.update_or_create(company=companyTarget, **department_info)
            # print(departmentTarget)
            post.company_id = company_name
            post.department_id = departmentTarget.id

            if post_info['degree'] is None:
                post_info['degree'] = 0

            post.description = post_name
            post.name = post_name
            post.degree = post_info['degree']
            post.degree_min = degreeMin
            post.degree_max = degreeMax
            post.address_province = post_info['address_province']
            post.address_city = post_info['address_city']
            post.address_district = post_info['address_district']
            post.address_street = post_info['address_street']

            post.age_min = ageMin
            post.age_max = ageMax
            post.graduatetime_min = graduate_S
            post.graduatetime_max = graduate_E
            post.salary_offer = str(post_info['salary_offer'])
            post.gender = gender

            post.linkman = post_info['linkman']
            post.linkman_phone = post_info['linkman_phone']
            post.project_name = post_info['project_name']
            post.p_type = post_info['p_type']
            post.baiying_task_name = post_info['baiying_task_name']
            print(post_info['baiying_task_id'])
            post.baiying_task_id = post_info['baiying_task_id']
            post.resume_latest_modified = post_info['resume_latest_modified']
            post.talk_hint = post_info['talk_hint']
            post.prologue = post_info['prologue']
            post.workplace = post_info['workplace']

            post.work_purpose = post_info['work_purpose']
            post.wechat_invite = post_info['wechat_invite']


            post.yaoyuemuban = post_info['yaoyuemuban']
            post.mianshimuban = post_info['mianshimuban']
            post.offermuban = post_info['offermuban']


            # post.invite_voice = post_info['invite_voice']
            # post.offer_voice = post_info['offer_voice']
            post.keywords = post_info['keywords']
            # post.level = post_info['level']

            # print(post_info)
            post.yaoqiu = yaoqiu

            # append
            post.hangyeleibie = hangyeleibie
            post.gangweileibie = gangweileibie
            post.gangweijibie = gangweijibie
            post.gangweizuoxi = gangweizuoxi
            post.shebaogongjijin = shebaogongjijin
            post.gangweitezheng = gangweitezheng
            post.xinzidaiyu = xinzidaiyu

            post.address_suite = address_suite
            post.extra_address = extra_address
            post.question = question

            post.save()
        else:
            companyTarget, created = Company.objects.update_or_create(**company_info)
            departmentTarget, created = Department.objects.update_or_create(company=companyTarget, **department_info)
            postTarget, created = Post.objects.update_or_create(company=companyTarget, department=departmentTarget,
                                                                **post_info)

        # After the post info created, we should add the
        # the right to the owner, and by the
        return HttpResponse("success")

        """
        serializer = PostSerializer(data=post_info)
        if serializer.is_valid(raise_exception=True):
            post_saved = serializer.save()
        else:
            print("Fail to serialize the post")
        """
    print('fail4')
    return HttpResponse("请求方式有误")
