# -*- encoding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models
from .choices import (BIRTH_YEAR_CHOICES, MAJOR_CHOICES, MARRIAGE_CHOICES, EDUCATION_TYPE_CHOICES)
from ordov.choices import (DEGREE_CHOICES, DEGREE_CHOICES_MAP, HUNTING_STATUS_CHOICES, HUNTING_STATUS_CHOICES_MAP)
from candidates.models import Candidate
from model_utils import Choices
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from companies.models import Post

# Create your models here.

class Resume(models.Model):
    # The Resume would be linked to a candidate afterwards
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, blank=True, null=True)
    resume_id = models.IntegerField(null=True)
    visible = models.BooleanField(default=False)
    resume_way = models.CharField(max_length=250, blank=True, null=True)
    resume_way2 = models.CharField(max_length=250, blank=True, null=True)

    # base info
    username = models.CharField(max_length=10, blank=True, null=True)
    gender = models.CharField(choices=(("m", "男"), ("f", "女"),), max_length=1, blank=True, null=True)
    birth_year = models.CharField(max_length=4, blank=True, null=True)
    birth_month = models.CharField(max_length=4, blank=True, null=True)
    birth_day = models.CharField(max_length=4, blank=True, null=True)
    date_of_birth = models.DateTimeField(blank=True, null=True)
    identity = models.CharField(max_length=25, blank=True, null=True)
    age = models.IntegerField(null=True)

    # birth place (jiguan in chinese)
    birth_province = models.CharField(max_length=10, blank=True, null=True)
    birth_city = models.CharField(max_length=10, blank=True, null=True)
    birth_district = models.CharField(max_length=10, blank=True, null=True)
    birth_street = models.CharField(max_length=10, blank=True, null=True)
    birth_place = models.CharField(max_length=50, blank=True, null=True)

    # social info
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    qq = models.BigIntegerField(null=True, blank=True)
    residence = models.CharField(max_length=50, blank=True, null=True)
    email = models.CharField(max_length=50, blank=True, null=True)
    marriage = models.CharField(max_length=10, blank=True, null=True, choices=MARRIAGE_CHOICES)
    live_state = models.CharField(max_length=10, blank=True, null=True)

    # resident info
    current_settle_province = models.CharField(max_length=10, blank=True, null=True)
    current_settle_city = models.CharField(max_length=10, blank=True, null=True)
    current_settle_district = models.CharField(max_length=10, blank=True, null=True)
    current_settle_street = models.CharField(max_length=20, blank=True, null=True)
    current_settle_xx = models.CharField(max_length=1000, blank=True, null=True)


    # Expection info
    expected_industry = models.CharField(max_length=50, null=True, blank=True)
    expected_salary = models.CharField(max_length=50, null=True, blank=True)
    expected_post = models.CharField(max_length=50, null=True, blank=True)
    expected_positon = models.CharField(max_length=50, null=True, blank=True)
    expected_restmodel = models.CharField(max_length=50, null=True, blank=True)
    expected_insurance_place_type = models.CharField(max_length=50, null=True, blank=True)
    expected_insurance_time_type = models.CharField(max_length=50, null=True, blank=True)

    expected_province = models.CharField(max_length=50, null=True, blank=True)
    expected_city = models.CharField(max_length=50, null=True, blank=True)
    expected_district = models.CharField(max_length=50, null=True, blank=True)
    expected_street = models.CharField(max_length=50, null=True, blank=True)

    # education related
    degree = models.IntegerField(blank=True, null=True, choices=DEGREE_CHOICES)
    major = models.CharField(max_length=30, blank=True, null=True)
    school = models.CharField(max_length=30, blank=True, null=True)
    graduate_time = models.CharField(max_length=30, blank=True, null=True)
    graduate_year = models.IntegerField(null=True, blank=True)

    ai_called = models.CharField(max_length=5000, blank=True, null=True)

    # Text Fieled
    self_description = models.TextField(max_length=500, blank=True, null=True, default='')

    # reserved Field
    reserved1 = models.CharField(max_length=50, blank=True, null=True, default='')
    reserved2 = models.CharField(max_length=50, blank=True, null=True, default='')

    # status
    hunting_status = models.IntegerField(blank=True, null=True, choices=HUNTING_STATUS_CHOICES)

    # ai info
    callInstanceId = models.CharField(max_length=50, blank=True, null=True)
    callPhoneDuration = models.CharField(max_length=100, blank=True, null=True)
    callTags = models.CharField(max_length=100, blank=True, null=True)
    callJobname = models.CharField(max_length=100, blank=True, null=True)

    importer = models.CharField(max_length=255, blank=True, null=True)


    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__ (self):
        return self.username

class AddResume(models.Model):
    # The Resume would be linked to a candidate afterwards
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, blank=True, null=True)
    resume_id = models.IntegerField(null=True)
    visible = models.BooleanField(default=False)
    resume_way = models.CharField(max_length=250, blank=True, null=True)
    resume_way2 = models.CharField(max_length=250, blank=True, null=True)

    # base info
    username = models.CharField(max_length=10, blank=True, null=True)
    gender = models.CharField(choices=(("m", "男"), ("f", "女"),), max_length=1, blank=True, null=True)
    birth_year = models.CharField(max_length=4, blank=True, null=True)
    birth_month = models.CharField(max_length=4, blank=True, null=True)
    birth_day = models.CharField(max_length=4, blank=True, null=True)
    date_of_birth = models.DateTimeField(blank=True, null=True)
    identity = models.CharField(max_length=25, blank=True, null=True)
    age = models.IntegerField(null=True)

    # birth place (jiguan in chinese)
    birth_province = models.CharField(max_length=10, blank=True, null=True)
    birth_city = models.CharField(max_length=10, blank=True, null=True)
    birth_district = models.CharField(max_length=10, blank=True, null=True)
    birth_street = models.CharField(max_length=10, blank=True, null=True)
    birth_place = models.CharField(max_length=50, blank=True, null=True)

    # social info
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    qq = models.BigIntegerField(null=True, blank=True)
    residence = models.CharField(max_length=50, blank=True, null=True)
    email = models.CharField(max_length=50, blank=True, null=True)
    marriage = models.CharField(max_length=10, blank=True, null=True, choices=MARRIAGE_CHOICES)
    live_state = models.CharField(max_length=10, blank=True, null=True)

    # resident info
    current_settle_province = models.CharField(max_length=10, blank=True, null=True)
    current_settle_city = models.CharField(max_length=10, blank=True, null=True)
    current_settle_district = models.CharField(max_length=10, blank=True, null=True)
    current_settle_street = models.CharField(max_length=20, blank=True, null=True)
    current_settle_xx = models.CharField(max_length=1000, blank=True, null=True)


    # Expection info
    expected_industry = models.CharField(max_length=50, null=True, blank=True)
    expected_salary = models.CharField(max_length=50, null=True, blank=True)
    expected_post = models.CharField(max_length=50, null=True, blank=True)
    expected_positon = models.CharField(max_length=50, null=True, blank=True)
    expected_restmodel = models.CharField(max_length=50, null=True, blank=True)
    expected_insurance_place_type = models.CharField(max_length=50, null=True, blank=True)
    expected_insurance_time_type = models.CharField(max_length=50, null=True, blank=True)

    expected_province = models.CharField(max_length=50, null=True, blank=True)
    expected_city = models.CharField(max_length=50, null=True, blank=True)
    expected_district = models.CharField(max_length=50, null=True, blank=True)
    expected_street = models.CharField(max_length=50, null=True, blank=True)

    # education related
    degree = models.IntegerField(blank=True, null=True, choices=DEGREE_CHOICES)
    major = models.CharField(max_length=30, blank=True, null=True)
    school = models.CharField(max_length=30, blank=True, null=True)
    graduate_time = models.CharField(max_length=30, blank=True, null=True)
    graduate_year = models.IntegerField(null=True, blank=True)

    ai_called = models.CharField(max_length=5000, blank=True, null=True)

    # Text Fieled
    self_description = models.TextField(max_length=500, blank=True, null=True, default='')

    # reserved Field
    reserved1 = models.CharField(max_length=50, blank=True, null=True, default='')
    reserved2 = models.CharField(max_length=50, blank=True, null=True, default='')

    # status
    hunting_status = models.IntegerField(blank=True, null=True, choices=HUNTING_STATUS_CHOICES)

    # ai info
    callInstanceId = models.CharField(max_length=50, blank=True, null=True)
    callPhoneDuration = models.CharField(max_length=100, blank=True, null=True)
    callTags = models.CharField(max_length=100, blank=True, null=True)
    callJobname = models.CharField(max_length=100, blank=True, null=True)

    importer = models.CharField(max_length=255, blank=True, null=True)


    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__ (self):
                return self.username

class Education(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, default='')
    start = models.DateField(blank=True, null=True)
    end = models.DateField(blank=True, null=True)

    # basic info
    school = models.CharField(max_length=50, blank=True, null=True)
    college = models.CharField(max_length=50, blank=True, null=True)
    major = models.CharField(max_length=50, blank=True, null=True)
    degree = models.IntegerField(choices=DEGREE_CHOICES, blank=True, null=True)
    edu_type = models.CharField(max_length=50, choices=EDUCATION_TYPE_CHOICES, blank=True, null=True)

    # resident info
    province = models.CharField(max_length=10, blank=True, null=True)
    city = models.CharField(max_length=10, blank=True, null=True)
    district = models.CharField(max_length=10, blank=True, null=True)
    street = models.CharField(max_length=20, blank=True, null=True)
    place = models.CharField(max_length=50, blank=True, null=True)

    instructor = models.CharField(max_length=50, blank=True, null=True)
    instructor_phone = models.CharField(max_length=15, null=True, blank=True)

    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self):
        return self.degree

class Tag(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, default='')
    recuriter = models.CharField(max_length=50, blank=True, null=True)
    tag = models.CharField(max_length=50, blank=True, null=True)

    # 增加操作姓名，环节名称
    operator = models.CharField(max_length=50, blank=True, null=True)
    step = models.CharField(max_length=50, blank=True, null=True)

    post_id = models.IntegerField(null=True)
    interview_id = models.IntegerField(null=True)
    interview_status = models.IntegerField(null=True)


    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)


# 记录test弹窗的几个操作记录，需要在页面上显示
class OperatorLog(models.Model):


    # 简历id
    resume = models.IntegerField(blank=True, null=True)
    # 操作的字段
    col = models.CharField(max_length=255, blank=True, null=True)
    # 设置的值
    val = models.CharField(max_length=255, blank=True, null=True)
    remark = models.CharField(max_length=255, blank=True, null=True)

    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)


class LabelLib(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    parent = models.IntegerField(blank=True, null=True, default=0)
    kind = models.CharField(max_length=255, blank=True, null=True)
    sort = models.IntegerField(blank=True, null=True, default=0)

    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

    deleted = models.IntegerField(blank=True, null=True, default=0)


# 前端resumeLog记录，创建map映射字段进行对这个表的操作
# 记录打的标签 分数
class LabelScore(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, default='', related_name="RESUME_SCORE")
    # 岗位不满意 or 行业不满意
    label = models.CharField(max_length=255, blank=True, null=True)
    # 岗位不满意，val就是岗位的lablelib id 可以为空，如薪资等，没有这个字段
    val = models.IntegerField(blank=True, null=True, default=0)
    score = models.IntegerField(blank=True, null=True, default=10)

    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)


class LabelScoreLog(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, default='', related_name="RESUME_SCORE_LOG")
    val = models.CharField(max_length=255, blank=True, null=True)
    label = models.CharField(max_length=255, blank=True, null=True)
    num = models.IntegerField(blank=True, null=True, default=0)
    score = models.IntegerField(blank=True, null=True, default=10)

    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
