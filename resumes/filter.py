# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views import generic

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets, status


import logging

logger = logging.getLogger('django')

# Create your views here.
from .models import Resume, LabelLib, LabelScore
from companies.models import Post
from .models import Education
from experiences.models import Experience, Project, Language, Certification
from .serializers import ResumeSerializer, EducationSerializer
from datatableview.views import DatatableView
from datatableview.utils import *
from django.http import JsonResponse, HttpResponse
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework import permissions

from accounts.models import UserProfile
from django.contrib.auth.models import User
from permissions.models import ProjectPermission

from .choices import (BIRTH_YEAR_CHOICES, MAJOR_CHOICES, MARRIAGE_CHOICES, EDUCATION_TYPE_CHOICES)
from ordov.choices import (DEGREE_CHOICES, DEGREE_CHOICES_MAP, HUNTING_STATUS_CHOICES, HUNTING_STATUS_CHOICES_MAP)

from model_utils import Choices

ORDER_COLUMN_CHOICES = Choices(
    ('0', 'id'),  # CK
    ('1', 'interview_id'),  # IID
    ('2', 'candidate_id'),  # CID
    ('3', 'id'),  # ID
    ('4', 'username'),  # *Name
    ('5', 'gender'),  # Gender
    ('6', 'age'),  # Age
    ('7', 'phone_number'),  # Phone
    ('8', 'email'),  # email
    ('9', 'school'),  # school
    ('10', 'degree'),  # degree
    ('11', 'major'),  # *Major
    ('12', 'is_match'),  # ismatch
    ('13', 'status'),  # status
    ('14', 'id'),  # action
    ('15', 'last_modified'),  # action
)

import json
def FilterResumeByPostRequest(queryset, post_id, status_id=None):
    post_request = None
    try:
        post_request = Post.objects.get(id=post_id)
    except (ObjectDoesNotExist, MultipleObjectsReturned):
        print("EXCEPT: ObjectDoesNotExist, MultipleObjectsReturned")

    if post_request:
        post_age_min = post_request.age_min or 0
        post_age_max = post_request.age_max or 100
        post_degree_min = post_request.degree_min or 0
        post_degree_max = post_request.degree_max or 100
        post_gender = post_request.gender or ""
        post_province = post_request.address_province
        post_city = post_request.address_city
        post_district = post_request.address_district
        post_resume_latest_modified = post_request.resume_latest_modified

        queryset = queryset.filter(models.Q(degree__gte=post_degree_min) &
                                   models.Q(degree__lte=post_degree_max) &
                                   models.Q(age__gte=post_age_min) &
                                   models.Q(age__lte=post_age_max))
        if post_gender.find(u'男') >= 0:
            queryset = queryset.filter(models.Q(gender__contains='m'))
        elif post_gender.find(u'女') >= 0:
            queryset = queryset.filter(models.Q(gender__contains='f'))

        # post_province/city/district filter
        # post_province/city/district filter

        # if post_province and post_province != "":
        #     queryset = queryset.filter(models.Q(expected_province__exact='') |
        #                                models.Q(expected_province__isnull=True) |
        #                                models.Q(expected_province__icontains=post_province))
        if post_city and post_city != "":
            queryset = queryset.filter(models.Q(current_settle_city__exact='') |
                                       models.Q(current_settle_city__isnull=True) |
                                       models.Q(current_settle_city__icontains=post_city))
        # if post_district and post_district != "":
        #     queryset = queryset.filter(models.Q(expected_district__exact='') |
        #                                models.Q(expected_district__isnull=True) |
        #                                models.Q(expected_district__icontains=post_district))

        if status_id is not None and status_id in [0, 1, 2]:
            if post_resume_latest_modified is not None:
                queryset = queryset.filter(models.Q(last_modified__gte=post_resume_latest_modified))

        def is_number(str):
            try:
                # 因为使用float有一个例外是'NaN'
                if str == 'NaN':
                    return False
                float(str)
                return True
            except ValueError:
                return False

        # FIXME:2020年04月15日14:52:09
        # 这里原本是 >= ,是取出符合条件的结果，不包括空值
        # 改完后是,物流行业 -5 , 那我就要>= -5 或者简历空值

        if post_request.yaoqiu is not None and post_request.yaoqiu != '':
            yaoqiu_json = json.loads(post_request.yaoqiu)
            for y in yaoqiu_json:
                hangyeleibie = yaoqiu_json[y][0]
                hangyeleibie_val = yaoqiu_json[y][1]
                if hangyeleibie == '' or hangyeleibie_val == '':
                    continue
                if y == 'xinzidaiyu':
                    queryset = queryset.filter(models.Q(RESUME_SCORE__label=y) &
                                               models.Q(RESUME_SCORE__score__lt=hangyeleibie)
                                               )
                else:
                    if hangyeleibie is not None and hangyeleibie != '' and is_number(hangyeleibie_val):
                        # 这3个多选，中文，且需要遍历
                        mutl_sel_opts = ['hangyeleibie', 'gangweileibie', 'gangweitezheng']
                        op_spet = '|'
                        if 'gangweitezheng' == y:
                            op_spet = ','
                        if y in mutl_sel_opts:
                            for p in hangyeleibie.split(op_spet):
                                if p == '':
                                    continue
                                lb = LabelLib.objects.get(deleted=0, name=p, kind=y)
                                rids = LabelScore.objects.all().filter(label=y, val=lb.id)
                                ids = []
                                for r in rids:
                                    ids.append(r.resume_id)
                                rrids = Resume.objects.all().exclude(id__in=ids)
                                rrid = []
                                for rr in rrids:
                                    rrid.append(rr.id)


                                queryset = queryset.filter(models.Q(id__in=rrid) |
                                                           (models.Q(RESUME_SCORE__label=y) &
                                                            models.Q(RESUME_SCORE__val=lb.id) &
                                                            models.Q(RESUME_SCORE__score__lt=hangyeleibie_val))
                                                           )
                                # models.Q(RESUME_SCORE__id__isnull=True)
                                #  models.Q(RESUME_SCORE__label=y) &
                                # models.Q(RESUME_SCORE__val=lb.id) &
                                # models.Q(RESUME_SCORE__score__lt=hangyeleibie_val)
                        else:
                            rids = LabelScore.objects.all().filter(label=y, val=hangyeleibie)
                            ids = []
                            for r in rids:
                                ids.append(r.resume_id)
                            rrids = Resume.objects.all().exclude(id__in=ids)
                            rrid = []
                            for rr in rrids:
                                rrid.append(rr.id)
                            queryset = queryset.filter(models.Q(id__in=rrid) |
                                                       models.Q(RESUME_SCORE__label=y) &
                                                       models.Q(RESUME_SCORE__val=hangyeleibie) &
                                                       models.Q(RESUME_SCORE__score__lt=hangyeleibie_val)
                                                       )

            # # 处理新字段
            # hangyeleibie = kwargs.get('hangyeleibie', [''])[0]
            # hangyeleibie_val = kwargs.get('hangyeleibie_val', [''])[0]
            # if hangyeleibie is not None and hangyeleibie != '' and is_number(hangyeleibie_val):
            #     queryset = queryset.filter(models.Q(RESUME_SCORE__label='hangyeleibie') &
            #                                models.Q(RESUME_SCORE__val=hangyeleibie) &
            #                                models.Q(RESUME_SCORE__score__lt=hangyeleibie_val)
            #                                )
            #
            # # 岗位类别
            # gangweileibie = kwargs.get('gangweileibie', [''])[0]
            # gangweileibie_val = kwargs.get('gangweileibie_val', [''])[0]
            # if gangweileibie is not None and gangweileibie != '' and is_number(gangweileibie_val):
            #     queryset = queryset.filter(models.Q(RESUME_SCORE__label='gangweileibie') &
            #                                models.Q(RESUME_SCORE__val=gangweileibie) &
            #                                models.Q(RESUME_SCORE__score__gt=gangweileibie_val)
            #                                )
            #
            # # 岗位级别
            # gangweijibie = kwargs.get('gangweijibie', [''])[0]
            # gangweijibie_val = kwargs.get('gangweijibie_val', [''])[0]
            # if gangweijibie is not None and gangweijibie != '' and is_number(gangweijibie_val):
            #     queryset = queryset.filter(models.Q(RESUME_SCORE__label='gangweijibie') &
            #                                models.Q(RESUME_SCORE__val=gangweijibie) &
            #                                models.Q(RESUME_SCORE__score__gt=gangweijibie_val)
            #                                )
            #
            # # 岗位作息
            # gangweizuoxi = kwargs.get('gangweizuoxi', [''])[0]
            # gangweizuoxi_val = kwargs.get('gangweizuoxi_val', [''])[0]
            # if gangweizuoxi is not None and gangweizuoxi != '' and is_number(gangweizuoxi_val):
            #     queryset = queryset.filter(models.Q(RESUME_SCORE__label='gangweizuoxi') &
            #                                models.Q(RESUME_SCORE__val=gangweizuoxi) &
            #                                models.Q(RESUME_SCORE__score__gt=gangweizuoxi_val)
            #                                )
            # # 社保公积金
            # shebaogongjijin = kwargs.get('shebaogongjijin', [''])[0]
            # shebaogongjijin_val = kwargs.get('shebaogongjijin_val', [''])[0]
            # if shebaogongjijin is not None and shebaogongjijin != '' and is_number(shebaogongjijin_val):
            #     queryset = queryset.filter(models.Q(RESUME_SCORE__label='shebaogongjijin') &
            #                                models.Q(RESUME_SCORE__val=shebaogongjijin) &
            #                                models.Q(RESUME_SCORE__score__gt=shebaogongjijin_val)
            #                                )
            #
            # # 岗位特征
            # gangweitezheng = kwargs.get('gangweitezheng', [''])[0]
            # gangweitezheng_val = kwargs.get('gangweitezheng_val', [''])[0]
            # if gangweitezheng is not None and gangweitezheng != '' and is_number(gangweitezheng_val):
            #     queryset = queryset.filter(models.Q(RESUME_SCORE__label='gangweitezheng') &
            #                                models.Q(RESUME_SCORE__val=gangweitezheng) &
            #                                models.Q(RESUME_SCORE__score__gt=gangweitezheng_val)
            #                                )
            # # 薪资待遇
            # xinzidaiyu = kwargs.get('xinzidaiyu', [''])[0]
            # print('薪资待遇=', xinzidaiyu)
            # if xinzidaiyu is not None and is_number(xinzidaiyu):
            #     print('query.')
            #     queryset = queryset.filter(models.Q(RESUME_SCORE__label='xinzidaiyu') &
            #                                models.Q(RESUME_SCORE__score__gt=xinzidaiyu)
            #                                )

        # 下面是默认屏蔽的项目
        rids = LabelScore.objects.filter(label='weilianxishang')
        ids = []
        for r in rids:
            ids.append(r.resume_id)
        # rrids = Resume.objects.all().exclude(id__in=ids)
        # rrid = []
        # for rr in rrids:
        #     rrid.append(rr.id)

        queryset = queryset.filter(
                                ~models.Q(id__in=ids) |
                                   (models.Q(RESUME_SCORE__label='weilianxishang') &
                                    models.Q(RESUME_SCORE__score__gt=5))
                                   )

        rids = LabelScore.objects.filter(label='haomacuowu')
        ids = []
        for r in rids:
            ids.append(r.resume_id)
        # rrids = Resume.objects.all().exclude(id__in=ids)
        # rrid = []
        # for rr in rrids:
        #     rrid.append(rr.id)

        queryset = queryset.filter(
                                ~models.Q(id__in=ids) |
                                   (models.Q(RESUME_SCORE__label='haomacuowu') &
                                    models.Q(RESUME_SCORE__score__gt=3))
                                   )

    return queryset


def FilterResumeByCustomizedRequest(queryset, **kwargs):
    # The Following valus are filter under '岗位要求设置'
    # which is temporary
    search_value = kwargs.get('search[value]', [0])[0]

    age_min = kwargs.get('age_id_min', [''])[0] or 0
    age_max = kwargs.get('age_id_max', [''])[0] or 1000

    degree_min = kwargs.get('degree_id_min', [''])[0]
    degree_max = kwargs.get('degree_id_max', [''])[0]

    graduate_time_min = kwargs.get('graduate_time_min', [''])[0]
    graduate_time_max = kwargs.get('graduate_time_max', [''])[0]

    expected_province = kwargs.get('province', [''])[0]
    expected_city = kwargs.get('city', [''])[0]
    expected_district = kwargs.get('district', [''])[0]
    expected_street = kwargs.get('working_place_street', [''])[0]


    gender_f = kwargs.get('gender_id', [''])[0]

    # filter and orderby
    if not gender_f.find(u'不限') >= 0:
        if gender_f.find(u'男') >= 0:
            queryset = queryset.filter(models.Q(gender__contains='m'))
        elif gender_f.find(u'女') >= 0:
            queryset = queryset.filter(models.Q(gender__contains='f'))

    degree_id_min = DEGREE_CHOICES_MAP.get(degree_min, 0)
    degree_id_max = 100

    age_id_min = 0
    if not age_min == '':
        age_id_min = int(age_min)
    age_id_max = 0
    if not age_max == '':
        age_id_max = int(age_max)

    if not degree_max.find(u'不限') >= 0:
        degree_id_max = DEGREE_CHOICES_MAP.get(degree_max, 100)

    queryset = queryset.filter(models.Q(degree__gte=degree_id_min) &
                               models.Q(degree__lte=degree_id_max) &
                               models.Q(age__gte=age_id_min) &
                               models.Q(age__lte=age_id_max))

    # graducate_time filter
    graduate_time_min_int = 0
    graduate_time_max_int = 100000
    if not graduate_time_min == "" and graduate_time_min.find(u'不限') < 0:
        graduate_time_min_int = int(graduate_time_min)
        queryset = queryset.filter(models.Q(graduate_year__gte=graduate_time_min_int))
    if not graduate_time_max == "" and graduate_time_max.find(u'不限') < 0:
        graduate_time_max_int = int(graduate_time_max)
        queryset = queryset.filter(models.Q(graduate_year__gte=graduate_time_max_int))

    # expected_province/city/district filter

    # FIXME:2020年04月07日14:17:59：临时调整为只过滤市

    # if not expected_province == "":
    #     queryset = queryset.filter(models.Q(expected_province__exact='') |
    #                                models.Q(expected_province__isnull=True) |
    #                                models.Q(expected_province__icontains=expected_province))
    # if not expected_city == "":
    #     queryset = queryset.filter(models.Q(expected_city__exact='') |
    #                                models.Q(expected_city__isnull=True) |
    #                                models.Q(expected_city__icontains=expected_city))
    # if not expected_district == "":
    #     queryset = queryset.filter(models.Q(expected_district__exact='') |
    #                                models.Q(expected_district__isnull=True) |
    #                                models.Q(expected_district__icontains=expected_district))
    # if not expected_street == "":
    #     queryset = queryset.filter(models.Q(expected_street__exact='') |
    #                                models.Q(expected_street__isnull=True) |
    #                                models.Q(expected_street__icontains=expected_street))



    # search_value box
    if search_value:
        # split the fields by blank
        # max 4 field to check
        fields = search_value.split()
        for i in range(0, min(len(fields), 4)):
            field = fields[i]
            queryset = queryset.filter(models.Q(username__icontains=field) |
                                       models.Q(phone_number__icontains=field) |
                                       models.Q(email__icontains=field) |
                                       models.Q(school__icontains=field) |
                                       models.Q(major__icontains=field) |
                                       models.Q(experience__post_name__icontains=field) |
                                       models.Q(experience__company_name__icontains=field))
        queryset = queryset.distinct()

    return queryset


# query_resume_by_args is call By the user-defined filter Info
def query_resumes_by_args(user, **kwargs):
    logger.info("开始查询简历详细数据")
    draw = int(kwargs.get('draw', [0])[0])
    length = int(kwargs.get('length', [10])[0])
    start = int(kwargs.get('start', [0])[0])
    order_column = kwargs.get('order[0][column]', [0])[0]

    order = kwargs.get('order[0][dir]', [0])[0]

    if order_column == 0:
        order_column = 'last_modified'
        order = 'desc'

    order_column = ORDER_COLUMN_CHOICES[int(order_column)][1]
    if order == 'desc':
        order_column = '-' + order_column


    status_id = int(kwargs.get('status_id', [0])[0])
    post_id = int(kwargs.get('post_id', [0])[0])

    logger.info("status_id:{},post_id:{}".format(status_id,post_id))
    print('status_id:{}'.format(status_id))
    # return
    status_id = int(status_id)
    # 转换status_id
    # if status_id == 1 or status_id == 2:
    #     status_id = 0

    # 等status_id的数量为214时，就对了

    if status_id == 0:
        queryset = Resume.objects.exclude((models.Q(interview__post__id=post_id)))
    elif status_id == 1:
        # queryset = Resume.objects.exclude((models.Q(interview__post__id=post_id)))
        queryset = Resume.objects.filter(
            (
                ~models.Q(interview__post__id=post_id)
            )
            |
            (models.Q(interview__status=status_id) &
             models.Q(interview__post__id=post_id) &
             models.Q(interview__is_active=True)
             ))

    elif status_id == 2:
        queryset = Resume.objects.filter(
            (
                ~models.Q(interview__post__id=post_id)
            )
            |
            (models.Q(interview__status__in=[1, 2]) &
             models.Q(interview__post__id=post_id) &
             models.Q(interview__is_active=True)
             ))
    elif status_id > 0:
        queryset = Resume.objects.filter(interview__status=status_id, interview__post__id=post_id,
                                         interview__is_active=True)
    elif status_id < 0:
        queryset = Resume.objects.filter(interview__status__gte=0, interview__post__id=post_id,
                                         interview__is_active=False)
    else:
        queryset = Resume.objects.all()

    # step1: Filter from post request
    print("status_id", status_id)
    queryset = FilterResumeByPostRequest(queryset, post_id, status_id)

    # step1.1: Skip ones who would not find a job
    if status_id in [0, 1, 2]:
        queryset = queryset.filter(~models.Q(hunting_status=1))
    queryset = queryset.distinct("id")
    total = queryset.count()

    logger.info("FilterResumeByPostRequest ， 查询基础数据结果，{}".format(total))

    # step2: Filter from user-defined filter
    queryset = FilterResumeByCustomizedRequest(queryset, **kwargs)
    queryset = queryset.distinct("id")

    count = queryset.count()

    logger.info("FilterResumeByCustomizedRequest 过滤之后的结果 {}".format(count))

    queryset = queryset.order_by(order_column)[start:start + length]

    # final decoration
    for q in queryset:
        q.degree = DEGREE_CHOICES[q.degree][1]
        q.gender = "Female" if (q.gender == 'f') else "Male"

    return {
        'items': queryset,
        'count': count,
        'total': total,
        'draw': draw,
    }


def query_libs_by_args(user, **kwargs):
    draw = int(kwargs.get('draw', [0])[0])
    length = int(kwargs.get('length', [10])[0])
    start = int(kwargs.get('start', [0])[0])
    # order_column = kwargs.get('order[0][column]', [0])[0]
    #
    # order = kwargs.get('order[0][dir]', [0])[0]
    #
    # if order_column == 0:
    #     order_column = 'last_modified'
    #     order = 'desc'

    # order_column = ORDER_COLUMN_CHOICES[int(order_column)][1]
    # if order == 'desc':
    #     order_column = '-' + order_column

    kind = kwargs.get('kind', [0])[0]
    parent = int(kwargs.get('parent', [0])[0])

    print('kind', kind)
    print('parent', parent)

    if kind is not None and kind != '':
        queryset = LabelLib.objects.filter(kind=kind, deleted=0)
        print('logic1')
    else:
        queryset = LabelLib.objects.all().filter(deleted=0)
        print('logic2')

    if parent is not None and parent != 0:
        print('logic3')
        queryset = LabelLib.objects.filter(parent=parent, deleted=0)
    # step1: Filter from post request

    # step1.1: Skip ones who would not find a job

    total = queryset.count()

    # step2: Filter from user-defined filter

    count = queryset.count()

    queryset = queryset.order_by('id')[start:start + length]

    return {
        'items': queryset,
        'count': count,
        'total': total,
        'draw': draw,
    }

