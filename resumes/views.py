# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from datetime import datetime, date
from datetime import timedelta

from dwebsocket.decorators import accept_websocket, require_websocket
import threading
from rest_framework import status as rest_status

import logging

logger = logging.getLogger('django')

from django.db.models import Count

from django.shortcuts import render
from django.views import generic

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets, status

# Create your views here.
from django.core import serializers
from .models import Resume, OperatorLog
from .filter import query_resumes_by_args, query_libs_by_args
from companies.models import Post
from .models import Education, Tag, LabelLib, LabelScore, LabelScoreLog,AddResume
from experiences.models import Experience, Project, Language, Certification
from .serializers import ResumeSerializer, EducationSerializer, TagSerializer, OperatorLogSerializer, LabelLibSerializer, LabelScoreSerializer, LabelScoreLogSerializer, AddResumeSerializer
from datatableview.views import DatatableView
from datatableview.utils import *
from django.http import JsonResponse, HttpResponse
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt

from rest_framework import permissions

from accounts.models import UserProfile
from django.contrib.auth.models import User
from permissions.models import ProjectPermission

import json
import re
import time


#
# @csrf_exempt
# def labelLibs(request):
#     kind = request.POST.get('kind')
#     print(kind)
#     libs = LabelLib.objects.all().filter(kind=kind)
#     data = json.loads(serializers.serialize("json", libs))
#     return JsonResponse(data,safe=False)




# 给以后如果有更多话务要求做准备
@accept_websocket
def conn_websocket(request):
    if request.is_websocket():  # 如果请求是websocket请求：

        WebSocket = request.websocket

        i = 0  # 设置发送至前端的次数
        messages = {}

        while True:
            i += 1  # 递增次数 i
            time.sleep(5)  # 休眠1秒

            # 判断是否通过websocket接收到数据
            if WebSocket.has_messages():

                # 存在Websocket客户端发送过来的消息
                client_msg = WebSocket.read().decode()
                post_msg = json.loads(client_msg)

                # 设置发送前端的数据
                messages = {
                    'time': time.strftime('%Y.%m.%d %H:%M:%S', time.localtime(time.time())),
                    'server_msg': 'send %d times!' % i,
                    'client_msg': post_msg['messageType'],
                }

            else:
                # 设置发送前端的数据
                messages = {
                    'messageType': 'pong',
                }

            # 设置发送数据为json格式
            request.websocket.send(json.dumps(messages))


class IsCreationOrIsAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        logger.info('debug has_permission')
        if request.user.is_authenticated is not True:
            logger.info('is_authenticated False')
            return False
        userProfile = UserProfile.objects.get(user=request.user)
        if userProfile.user_type == "Manager":
            return True;
        if userProfile.user_type != "Recruiter" and userProfile.user_type != "Employer":
            logger.info('Role is  False')
            return False;

        # Recruiter and Employer Scenario

        # To get the resumes
        # To Watching the resumes, For a Recruiter, you have limited permissions only by
        # For Recruiter, There should never get the
        # When Updating, you should add the interview
        # How to deliver the priviledge info for one http request
        # How about Put the stage info in http header?
        post = None

        resumeId = request.META.get('HTTP_ORDOV_RESUME_ID', -1)
        postId = request.META.get('HTTP_ORDOV_POST_ID', -1)
        interviewId = request.META.get('HTTP_ORDOV_INTERVIEW_ID', -1)
        statusId = request.META.get('HTTP_ORDOV_STATUS_ID', -1)
        print("resumeId", resumeId, "postId", postId, "interviewId", interviewId)
        if postId == '0' or postId == -1:
            return True
        try:
            post = Post.objects.get(id=postId)
        except:
            print("Could Not Found The post_id:", postId)

            logger.info('Could Not Found The post_id:{}'.format(postId))
            return False

        permission = ProjectPermission.objects.filter(user=userProfile, post=post, stage=statusId)
        if permission:
            print("has permission------------>")
            return True
        logger.info("query db permission:{}".format(permission))
        return False

class ResumeView(APIView):
    def get(self, request):
        resumes = Resume.objects.all()

        # resumes, generate more than one single resume, so many=true
        serializer = ResumeSerializer(resumes, many=True)
        return Response ({"resumes": serializer.data})

    def post(self, request):
        resume = request.data.get('resume')
        serializer = ResumeSerializer(data=resume)
        if serializer.is_valid(raise_exception=True):
            resume_saved = serializer.save()

        return Response(
            {"success": "Resume '{}' created successfully".format(resume_saved.username)}
        )


# dofinish 标记项目为完成
@csrf_exempt
def dofinish(request):
    id = request.POST['id']
    post = Post.objects.get(id=id)
    val = int(request.POST['val'])
    post.finished = val
    post.save()
    return HttpResponse("success")


# resume操作日志
@csrf_exempt
def opresumelog(request):
    resume = request.POST['resume']
    resume = int(resume)
    col = request.POST['col']
    val = request.POST['val']
    post = request.POST['post_id']
    log = OperatorLog(
        resume=resume,
        col=col,
        val=val
    )
    log.save()

    # 处理col为not的情况， 标记简历为不找工作 , 1
    r1 = Resume.objects.get(id=resume)
    if col == 'not':
        r1.hunting_status = 1
        r1.save()


    # score
    labelMap = {
        'expected_industry': 'hangyeleibie',
        'expected_post': 'gangweileibie',
        'expected_restmodel': 'gangweizuoxi',
        'expected_insurance_time_type': 'shebaogongjijin',
        'expected_salary': 'xinzidaiyu',

        'gangweitezheng': 'gangweitezheng',
        'gangweijibie': 'gangweijibie',
        # 这些字段不在企业里面 属于个人了
        'weilianxishang': 'weilianxishang',
        'haomacuowu': 'haomacuowu',

    }

    if col in labelMap:
        label = labelMap[col]

        # 最基础的，对行业岗位等字段减分
        if label == 'hangyeleibie' or label == 'gangweileibie' or label == 'gangweitezheng' :
            # 根据post对对应的字段进行扣减
            post = Post.objects.get(id=int(post))
            if getattr(post, label) is not None and getattr(post, label) != '':
                plabel_arr = getattr(post, label).split('|')
                for pl in plabel_arr:
                    op_score(resume, label, int(pl), False)

            # 对期望行业/岗位加分
            op_score(resume, label, int(val), True)
        elif label == 'gangweijibie' or label == 'gangweizuoxi' or label == 'shebaogongjijin'  or label == 'xinzidaiyu':
            # 对这些label以及sort < this的标签全部扣分 ， 企业的标签是单选
            post = Post.objects.get(id=int(post))
            if getattr(post, label) is not None and getattr(post, label) != '':
                plabel = int(getattr(post, label))
                print('plabel:',plabel)
                # 找小于等于他的标签（同类型）
                #plib_arr = LabelLib.objects.all.filter(
                 #   models.Q(sort__lte=plabel) &
                 #   models.Q(kind=label)
                #)
                op_score(resume, label, plabel, False)
               # for pl in plib_arr:
                #    op_score(resume, label, pl.id, False)
        else:
            # 简单类型 直接操作，这类label没有val，都是固定的
            op_score(resume, label, val, False)







    return HttpResponse("success")


op_score_map = {
    'hangyeleibie': 10,
    'gangweileibie': 10,
    'gangweizuoxi': 10,
    'shebaogongjijin': 10,
    'gangweitezheng': 10,
    'weilianxishang': 2,
    'haomacuowu': 3,
    'gangweijibie': 10,
}


def op_score(resume, label, val, is_add):
    lval = 0
    init_score = 10
    if label != 'xinzidaiyu' and label != 'weilianxishang' and label != 'haomacuowu':
        # ll = LabelLib.objects.get(id=val)
        # 应该都是id ， 没有中文不需要处理
        lval = val
    if label == 'xinzidaiyu':
        init_score = val
    if label == 'haomacuowu' or label == 'weilianxishang':
        val = 0
        lval = 0
    r = Resume.objects.get(id=int(resume))
    labelScore = None
    try:
        if label in op_score_map:
            labelScore = LabelScore.objects.get(label=label, resume=r, val=val)
        else:
            labelScore = LabelScore.objects.get(label=label, resume=r)

    except:
        print('labelScore is None')
    if labelScore is None:
        labelScore = LabelScore(
            resume=r,
            label=label,
            val=lval,
            score=init_score
        )
        labelScoreLog = LabelScoreLog(
            resume=r,
            label=label,
            val=lval,
            score=init_score,
            num=init_score
        )
        print('loglabel:', label, lval, init_score)
        labelScore.save()
        labelScoreLog.save()

    lscore = None
    if label in op_score_map:
        # 这里多了val条件，因为score_map里面都是二级属性，需要三个形参
        lscore = LabelScore.objects.get(label=label, resume=r, val=val)
    else:
        lscore = LabelScore.objects.get(label=label, resume=r)
    op_num = 0
    # 部分字段需要特殊处理

    if label in op_score_map:
        op_num = op_score_map[label]
        if is_add:
            lscore.score += op_num
        else:
            lscore.score -= op_num
        newlog = LabelScoreLog(
            resume=r,
            label=label,
            val=lval,
            score=lscore.score,
            num=op_num
        )
        newlog.save()
        lscore.save()
    elif label == 'xinzidaiyu':
        # avg
        log = LabelScoreLog.objects.all().filter(resume=r, label=label)
        cnt = len(log)
        total = int(val)
        for lg in log:
            if lg.val == 0:
                continue
            total += lg.score
        avg = total / cnt
        print('total:', total, "cnt:", cnt)
        lscore.score = avg
        newlog = LabelScoreLog(
            resume=r,
            label=label,
            val=val,
            score=val,
            num=val
        )
        newlog.save()
        lscore.save()





@csrf_exempt
def opresumeloglist(request):
    resume = request.GET.get('resume')
    data = {}
    book = OperatorLog.objects.all().filter(resume=resume)
    data['list'] = json.loads(serializers.serialize("json", book))
    return JsonResponse(data)


# 获得操作日志的的信息，消息框
@csrf_exempt
def msgbox(request):
    username = request.user.username
    logs = OperatorLog.objects.all()
    logs = logs.filter(
        col='not'
    )
    logs = logs.order_by('-id')[0:20]
    data = []
    for log in logs:
        resume = Resume.objects.get(id=log.resume)
        if resume is not None:
            data.append({
                "resume_username": resume.username,
                "created": log.created,
                "val": log.val
            })

    return JsonResponse(data, safe=False)




class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all().order_by('id')
    serializer_class = ResumeSerializer
    permission_classes = (IsCreationOrIsAuthenticated, )


    def list(self, request, **kwargs):
        query_params = request.query_params
        resume = query_resumes_by_args(request.user, **request.query_params)

        # init_status_id = query_params.get('status_id', [0])[0]
        #
        # if init_status_id == 1:
        #     query_params.set(status_id[0]




        post_id = int(request.query_params.get('post_id', 0))

        serializer = ResumeSerializer(
            resume['items'],
            many=True,
            context={'post_id': post_id}
        )
        result = dict()

        result['data'] = serializer.data
        tds = result['data']

        # here we can modify the response data, and we can add pesudo fields in
        # serializer, as we handled candidate_id
        for td in tds:
            td.update({'DT_RowId': td['id']})

        result['draw'] = resume['draw']
        result['recordsTotal'] = int(resume['total'])
        result['recordsFiltered'] = int(resume['count'])

        return Response(result, status=status.HTTP_200_OK, template_name=None, content_type=None)

class ResumeTable(generic.ListView):
    context_object_name = 't_resume_list'
    template_name = 'resumes/table_resumes.html'

    def get_queryset(self):
        return Resume.objects.all()

    def get_context_data(self, **kwargs):
        context = super(ResumeTable, self).get_context_data(**kwargs)
        context['template_table_name'] = 'Resume'

        return context

class MultiTable(generic.ListView):
    context_object_name = 't_resume_list'
    template_name = 'resumes/table_multi.html'

    def get_queryset(self):
        return Resume.objects.all()

    def get_context_data(self, **kwargs):
        context = super(MultiTable, self).get_context_data(**kwargs)
        context['template_table_name'] = 'Resume'
        userProfile = UserProfile.objects.get(user=self.request.user)
        if (userProfile.user_type == "Manager"):
            context['UserType'] = 'Manager'
        return context


class CompositeTable(DatatableView):
    model = Resume

    datatable_options = {
        'structure_template': "datatableview/bootstrap_structure.html",
        'columns' : [
            ('Resume', 'resume_id'),
            ('Name', 'username'),
            ('Gender', 'gender'),
            ('Age', 'age'),
            ('Phone', 'phone_number'),
            ('Email', 'email'),
            ('School', 'school'),
            ('Degree', 'degree'),
            ('Major', 'major'),
            ('Stat', None, 'get_entry_stat')
        ]}

    def get_entry_stat(self, instance, *args, **kwargs):
        return "ABC{}".format(instance.username)

    post_datatable_options = {
        'structure_template': "datatableview/bootstrap_structure.html",
        'columns': [
            'company',
            'department',
            'name',
        ]
    }

    def get_queryset(self, type=None):
        """
        Customized implementation of the queryset getter.  The custom argument ``type`` is managed
        by us, and is used in the context and GET parameters to control which table we return.
        """
        if type is None:
            type = self.request.GET.get('datatable-type', None)

        if type == "C_POST":
            return Post.objects.all()
        return super(CompositeTable, self).get_queryset()

    def get_datatable_options(self, type=None):
        """
        Customized implementation of the options getter.  The custom argument ``type`` is managed
        by us, and is used in the context and GET parameters to control which table we return.
        """
        if type is None:
            type = self.request.GET.get('datatable-type', None)

        options = self.datatable_options

        if type == "C_POST":
            # Return separate options settings
            options = self.post_datatable_options

        return options

    def get_datatable(self, type=None):
        """
        Customized implementation of the structure getter.  The custom argument ``type`` is managed
        by us, and is used in the context and GET parameters to control which table we return.
        """
        if type is None:
            type = self.request.GET.get('datatable-type', None)

        if type is not None:
            datatable_options = self.get_datatable_options(type=type)
            # Put a marker variable in the AJAX GET request so that the table identity is known
            ajax_url = self.request.path + "?datatable-type={type}".format(type=type)

        if type == "C_POST":
            # Change the reference model to Blog, instead of Entry
            datatable = get_datatable_structure(ajax_url, datatable_options, model=Post)
        else:
            return super(CompositeTable, self).get_datatable()

        return datatable


    def get_context_data(self, **kwargs):
        context = super(CompositeTable, self).get_context_data(**kwargs)

        # Get the other structure objects for the initial context
        context['post_datatable'] = self.get_datatable(type="C_POST")

        return context

# In detail View part, there are three part the
class ResumeDetail(generic.DetailView):
    model = Resume
    context_object_name = 't_resume_detail'
    template_name = 'recruit_manager/edit_resume.html'

@ensure_csrf_cookie
def ResumeDetailInfo(request, *args, **kwargs):
    idd = kwargs.get('pk', -1)
    if idd > 0:
        resume = None
        experience = None
        education = None
        project = None
        language = None
        certification = None
        try:
            resume = Resume.objects.get(pk=idd)
            experience = Experience.objects.all().filter(resume_id=idd)
            education = Education.objects.all().filter(resume_id=idd)
            project = Project.objects.all().filter(resume_id=idd)
            language = Language.objects.all().filter(resume_id=idd)
            certification = Certification.objects.all().filter(resume_id=idd)
        except ObjectDoesNotExist:
            print("Error", resume, experience, education)

        path = request.path
        isEdit = False
        isAdd = False
        if re.match(r'.*resumes/[0-9]*/edit', path):
            isEdit = True
            return render(request, "recruit_manager/edit_resume.html", locals())
        elif re.match(r'.*resumes/[0-9]*/add', path):
            isAdd= True
            return render(request, "recruit_manager/add_resume.html", locals())           
        return render(request, "recruit_manager/detail_resume.html", locals())

    else:
        return render(request, "recruit_manager/add_resume.html", locals())           
        #return HttpResponse("bad request")


class EducationView(APIView):
    def get(self, request):
        education = Education.objects.all()
        serializer = EducationSerializer(education, many=True)
        return Response({"educations": serializer.data})
    def post(self, request):
        education = request.data.get('education')
        serializer = EducationSerializer(data=education)
        if serializer.is_valid(raise_exception=True):
            education_saved = serializer.save()
        return Response(
            {"success": "Education '{}' created successfully".format(education_saved.school)}
        )

class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

    def get_queryset(self):
        qset = Education.objects.all()
        resume_id = self.request.query_params.get('resume_id', None)
        if resume_id is not None and resume_id.isdigit():
            qset = qset.filter(resume_id=resume_id)
        return qset

class LabelScoreViewSet(viewsets.ModelViewSet):
    queryset = LabelScore.objects.all()
    serializer_class = LabelScoreSerializer

    def get_queryset(self):
        qset = LabelScore.objects.all()
       # serializer = LabelScoreSerializer(qset, many=True)     
        resume = self.request.query_params.get('resume', None)
        print(resume)
        if resume is not None:
          qset = qset.filter(resume=resume)
        return qset
       # return Response({"LabelScore": serializer.data})

class LabelScoreLogViewSet(viewsets.ModelViewSet):
    queryset = LabelScoreLog.objects.all()
    serializer_class = LabelScoreLogSerializer

    def get_queryset(self):
        qset = LabelScoreLog.objects.all()
        resume_id = self.request.query_params.get('resume_id', None)
        if resume_id is not None :
            qset = qset.filter(resume=resume_id)
        return qset        

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_queryset(self):
        qset = Tag.objects.all()
        resume_id = self.request.query_params.get('resume_id', None)
        post_id = self.request.query_params.get('post_id', None)
       # interview_id = self.request.query_params.get('interview_id', None)
        interview_status = self.request.query_params.get('interview_status', None)
        if resume_id is not None and resume_id.isdigit():
            qset = qset.filter(resume_id=resume_id)
        if post_id is not None :
            qset = qset.filter(resume_id=resume_id,post_id=post_id,interview_status=interview_status)           
        return qset

# Interview Phone_Call_Log SubModal
# ---------------------------------------- Pretty Split Line ----------------------------------------
class Add_ResumeViewSet(viewsets.ModelViewSet):
    queryset = AddResume.objects.all()
    serializer_class = AddResumeSerializer
   # permission_classes = (IsCreationOrIsAuthenticated, )   

class LabelLibViewSet(viewsets.ModelViewSet):
    queryset = LabelLib.objects.all().order_by('parent')
    serializer_class = LabelLibSerializer

    # def get_queryset(self):
    #     qset = LabelLib.objects.all()
    #     kind = self.request.query_params.get('kind', None)
    #     if kind is not None:
    #         qset = qset.filter(kind=kind)
    #     return qset

    def list(self, request, **kwargs):
        resume = query_libs_by_args(request.user, **request.query_params)

        post_id = int(request.query_params.get('post_id', 0))

        serializer = LabelLibSerializer(
            resume['items'],
            many=True,
            context={'post_id': post_id}
        )
        result = dict()

        result['data'] = serializer.data
        tds = result['data']

        # here we can modify the response data, and we can add pesudo fields in
        # serializer, as we handled candidate_id
        for td in tds:
            td.update({'DT_RowId': td['id']})

        result['draw'] = resume['draw']
        result['recordsTotal'] = int(resume['total'])
        result['recordsFiltered'] = int(resume['count'])

        return Response(result, status=status.HTTP_200_OK, template_name=None, content_type=None)


@csrf_exempt
def call_flag(request):
    id = request.POST['id']
    post_id = request.POST['post_id']
    resume = Resume.objects.get(id=id)
    record = ''
    if resume.ai_called is None:
        record = ",".join([post_id])
    else:
        record = resume.ai_called.split(',')
        record.append(post_id)
        record = ",".join(record)
    resume.ai_called = record
    resume.save()
    return HttpResponse("success")


@csrf_exempt
def updatelib(request):
    id = request.POST['id']
    sort = request.POST['sort']
    sort = int(sort)
    id = int(id)
    lib = LabelLib.objects.get(id=id)
    lib.sort = sort
    lib.save()


    return HttpResponse("success")

# deleted => 1
@csrf_exempt
def delLib(request):
    id = request.POST['id']
    id = int(id)
    lib = LabelLib.objects.get(id=id)
    lib.deleted = 1
    lib.save()

    # child
    childs = LabelLib.objects.all().filter(parent=id)
    for c in childs:
        c.deleted = 1
        c.save()

    return HttpResponse("success")


@csrf_exempt
def addLib(request):
    name = request.POST.get('name', '')
    parent = request.POST.get('parent', '0')
    kind = request.POST.get('kind', '')

    if name == '':
        return HttpResponse('名称不能为空')
    if kind == '':
        return HttpResponse('类型不能为空')

    # 判断是否有没有删掉的分类
    try:
        # existsLib = LabelLib.objects.get(deleted=0, name=name, kind=kind)
        # 因为name有唯一索引，所以不能重复的
        existsLib = LabelLib.objects.get(deleted=0, name=name)
        if existsLib is not None:
            return HttpResponse('名称已存在')
    except (ObjectDoesNotExist, MultipleObjectsReturned):
        pass

    lib = LabelLib(
        name=name,
        parent=parent,
        kind=kind,
        sort=0,
        deleted=0
    )

    lib.save()
    return HttpResponse("添加成功")

@csrf_exempt
def editLib(request):
    id = request.POST['id']
    id = int(id)
    lib = LabelLib.objects.get(id=id)
    lib.name = request.POST['name']
    lib.save()
    return HttpResponse("success")


class LabelLibListViewSet(viewsets.ModelViewSet):
    queryset = LabelLib.objects.all()
    serializer_class = LabelLibSerializer

    def get_queryset(self):
        qset = LabelLib.objects.all().order_by('parent')
        kind = self.request.query_params.get('kind', None)
        lib_id = self.request.query_params.get('id', None)
        if kind is not None:
            qset = qset.filter(kind=kind, deleted=0)
        if lib_id is not None:
            qset = qset.filter(id=lib_id)    
        return qset


# ④最新更新日期超过7天未变化，简历归属人自动为空。 定时任务一天一次
def resumeLastModExpireSchedule():
    while True:
        logger.info('resumeSevenSchedule')
        sevenAgo = datetime.now() - timedelta(days=7)
        ninetyAgo = datetime.now() - timedelta(days=90)
        resumeList = Resume.objects.filter(
            models.Q(last_modified__lt=sevenAgo)
            &
            models.Q(last_modified__gt=ninetyAgo)
        )
        logger.info("resumeList长度={}".format(len(resumeList)))
        for resume in resumeList:
            resume.importer = ""
            resume.save()
            logger.info("{} , {} 已更新".format(resume.id, resume.username))

        ninetyAgo = datetime.now() - timedelta(days=90)
        resumeList2 = Resume.objects.filter(
            models.Q(last_modified__lt=ninetyAgo)
        )
        logger.info("resumeList2 长度={}".format(len(resumeList2)))

        for r in resumeList2:
            r.importer = "系统"
            r.hunting_status = 2
            r.save()

        time.sleep(86400)


def trimZero(s):
    if s is None or s == '':
        return ''
    if "." in s:
        return s[0:s.index('.')]
    return s


def isEmpty(v):
    return v is None or v == ''


def appendReusmeCols(base, source):
    # 赋值可以被覆盖的信息
    if isEmpty(base.resume_way):
        base.resume_way = source.resume_way
    if isEmpty(base.resume_way2):
        base.resume_way2 = source.resume_way2

    if isEmpty(base.birth_year):
        base.birth_year = source.birth_year
    if isEmpty(base.birth_month):
        base.birth_month = source.birth_month
    if isEmpty(base.birth_day):
        base.birth_day = source.birth_day
    # if isEmpty(base.date_of_birth):
    #     base.date_of_birth = source.date_of_birth
    if isEmpty(base.identity):
        base.identity = source.identity
    if isEmpty(base.age):
        base.age = source.age

    if isEmpty(base.birth_province) and isEmpty(base.birth_city) and isEmpty(base.birth_district):
        base.birth_province = source.birth_province
        base.birth_city = source.birth_city
        base.birth_district = source.birth_district

    # if isEmpty(base.birth_street):
    #     base.birth_street = source.birth_street
    # if isEmpty(base.birth_place):
    #     base.birth_place = source.birth_place

    # if isEmpty(base.birth_place):
    #     base.birth_place = source.birth_place

    # if isEmpty(base.qq):
    #     base.qq = source.qq
    # if isEmpty(base.residence):
    #     base.residence = source.residence
    if isEmpty(base.email):
        base.email = source.email
    if isEmpty(base.marriage):
        base.marriage = source.marriage
    if isEmpty(base.live_state):
        base.live_state = source.live_state

    if isEmpty(base.current_settle_province) and isEmpty(base.current_settle_city) and isEmpty(
            base.current_settle_district):
        base.current_settle_province = source.current_settle_province
        base.current_settle_city = source.current_settle_city
        base.current_settle_district = source.current_settle_district
    if isEmpty(base.current_settle_street):
        base.current_settle_street = source.current_settle_street

    # if isEmpty(base.expected_industry):
    #     base.expected_industry = source.expected_industry

    # if isEmpty(base.expected_salary):
    #     base.expected_salary = source.expected_salary
    # if isEmpty(base.expected_post):
    #     base.expected_post = source.expected_post
    # if isEmpty(base.expected_positon):
    #     base.expected_positon = source.expected_positon
    # if isEmpty(base.expected_restmodel):
    #     base.expected_restmodel = source.expected_restmodel
    # if isEmpty(base.expected_insurance_place_type):
    #     base.expected_insurance_place_type = source.expected_insurance_place_type
    # if isEmpty(base.expected_insurance_time_type):
    #     base.expected_insurance_time_type = source.expected_insurance_time_type

    if isEmpty(base.expected_province) and isEmpty(base.expected_city) and isEmpty(base.expected_district):
        base.expected_province = source.expected_province
        base.expected_city = source.expected_city
        base.expected_district = source.expected_district

    if isEmpty(base.expected_street):
        base.expected_street = source.expected_street
    if isEmpty(base.degree):
        base.degree = source.degree
    if isEmpty(base.major):
        base.major = source.major
    if isEmpty(base.school):
        base.school = source.school
    if isEmpty(base.graduate_time):
        base.graduate_time = source.graduate_time
    if isEmpty(base.graduate_year):
        base.graduate_year = source.graduate_year
    if isEmpty(base.self_description):
        base.self_description = source.self_description

    # TODO 其他的业务字段暂时不处理
    return base


# 合并简历，IO密集型,可以启动项目OR手动调用
def mergeExistsResume():
    logger.info('mergeExistsResume')
    # 找重复手机号
    resumeList = Resume.objects.values('phone_number').annotate(nums=Count('phone_number')).filter(nums__gt=1)
    resumeList.distinct()
    logger.info("找到手机号重复的简历,数量:{}".format(len(resumeList)))

    logger.info(resumeList)
    for resume in resumeList:
        op_resumes = Resume.objects.filter(phone_number=resume.get('phone_number', '')).order_by('id')
        resume_base = None
        if len(op_resumes) > 0:
            for idx, r in enumerate(op_resumes):
                if idx == 0:
                    resume_base = r
                    continue
                else:
                    logger.info("被合并的简历idx:{},id:{}".format(idx, r.id))
                    resume_base = appendReusmeCols(resume_base, r)
                    logger.info("id:{}已删除".format(r.id))
                    r.delete()
            # 完善建立后 修改状态并保存
            resume_base.hunting_status = 3
            resume_base.save()
            logger.info("Base简历(id:{})已保存".format(resume_base.id))
    # time.sleep(86400)


# mergeExistsResume()
thread1 = threading.Thread(target=resumeLastModExpireSchedule)
thread1.start()


def mergeOnceResumeLocation():
    logger.info("--mergeOnceResumeLocation")
    resumeList = Resume.objects.filter(
        models.Q(expected_province__isnull=False) &
        models.Q(expected_city__isnull=False) &
        models.Q(expected_district__isnull=False)
        &
        (models.Q(current_settle_province__isnull=True) | models.Q(current_settle_province='')) &
        (models.Q(current_settle_city__isnull=True) | models.Q(current_settle_city='')) &
        (models.Q(current_settle_district__isnull=True) | models.Q(current_settle_district=''))
    )
    resumeList.distinct()
    logger.info("mergeOnceResumeLocation len {}".format(len(resumeList)))
    for r in resumeList:
        logger.info("赋值id:{}".format(r.id))
        r.current_settle_province = r.expected_province
        r.current_settle_city = r.expected_city
        r.current_settle_district = r.expected_district
        r.save()


# mergeOnceResumeLocation()
